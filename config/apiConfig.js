import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Tạo instance của Axios với cấu hình cơ bản
const apiClient = axios.create({
  baseURL: "https://be-vaccine.vercel.app", // URL backend của bạn
  timeout: 10000, // Thời gian timeout 10 giây
});

// Log apiClient để kiểm tra (có thể xóa khi không cần debug)
console.log("apiClient initialized:", apiClient);

// Interceptor để thêm header x-auth-token vào mọi yêu cầu
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers["x-auth-token"] = token; // Thêm token vào header
        console.log("Token added to headers:", token); // Log để debug (tùy chọn)
      } else {
        console.log("No token found in AsyncStorage");
      }
      return config;
    } catch (error) {
      console.error("Error in request interceptor:", error);
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý phản hồi lỗi (tùy chọn, cải thiện trải nghiệm)
apiClient.interceptors.response.use(
  (response) => response, // Trả về response nếu thành công
  (error) => {
    console.error("Response error:", error.response?.data || error.message);
    return Promise.reject(error); // Trả về lỗi để xử lý ở nơi gọi
  }
);

const apiConfig = {
  // Lấy tất cả vaccine
  async getVaccines() {
    try {
      const response = await apiClient.get("/api/vaccines/get-vaccines");
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || error.message || "Lỗi không xác định";
      console.error("Error in getVaccines:", errorMessage);
      throw new Error(`Không thể tải dữ liệu vaccine: ${errorMessage}`);
    }
  },

  // Lấy chi tiết vaccine theo id
  async getVaccineById(id) {
    try {
      if (!id) throw new Error("ID vaccine không được cung cấp");
      const response = await apiClient.get(`/api/vaccines/get-vaccine/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || error.message || "Lỗi không xác định";
      console.error("Error in getVaccineById:", errorMessage);
      throw new Error(`Không thể tải chi tiết vaccine: ${errorMessage}`);
    }
  },

  // Đăng nhập
  async login(email, password) {
    try {
      if (!email || !password) {
        throw new Error("Email và mật khẩu là bắt buộc");
      }
      const response = await apiClient.post("/api/auth/login", {
        email,
        password,
      });
      return response.data; // Trả về token
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || error.message || "Lỗi không xác định";
      console.error("Error in login:", errorMessage);
      throw new Error(`Đăng nhập thất bại: ${errorMessage}`);
    }
  },

  // Đăng ký
  async register(name, email, password) {
    try {
      if (!name || !email || !password) {
        throw new Error("Tên, email và mật khẩu là bắt buộc");
      }
      const response = await apiClient.post("/api/auth/register-customer", {
        name,
        email,
        password,
      });
      return response.data; // Trả về token
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || error.message || "Lỗi không xác định";
      console.error("Error in register:", errorMessage);
      throw new Error(`Đăng ký thất bại: ${errorMessage}`);
    }
  },
  // Lấy danh sách trẻ em
  async getChildren() {
    try {
      const response = await apiClient.get("/api/children/get-children");
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || error.message || "Lỗi không xác định";
      console.error("Error in getChildren:", errorMessage);
      throw new Error(`Không thể tải danh sách trẻ em: ${errorMessage}`);
    }
  },

  // Thêm trẻ em
  async addChild(name, birthDate, gender, medicalHistory) {
    try {
      const response = await apiClient.post("/api/children/add-child", {
        name,
        birthDate,
        gender,
        medicalHistory,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || error.message || "Lỗi không xác định";
      console.error("Error in addChild:", errorMessage);
      throw new Error(`Thêm trẻ em thất bại: ${errorMessage}`);
    }
  },

  // Lấy danh sách lịch hẹn
  async getAppointments() {
    try {
      const response = await apiClient.get("/api/appointments/get-appointments");
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || error.message || "Lỗi không xác định";
      console.error("Error in getAppointments:", errorMessage);
      throw new Error(`Không thể tải danh sách lịch hẹn: ${errorMessage}`);
    }
  },

  // Đặt lịch hẹn
  async bookAppointment(childId, vaccineId, date) {
    try {
      if (!childId || !vaccineId || !date) {
        throw new Error("Thông tin childId, vaccineId và date là bắt buộc");
      }
      const response = await apiClient.post("/api/appointments/book-appointment", {
        childId,
        vaccineId,
        date,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || error.message || "Lỗi không xác định";
      console.error("Error in bookAppointment:", errorMessage);
      throw new Error(`Tạo lịch hẹn thất bại: ${errorMessage}`);
    }
  },
};

export default apiConfig;
import axios from 'axios';

const apiClient = axios.create({
    baseURL: "https://be-vaccine.vercel.app",
    timeout: 10000, // Thời gian timeout 10 giây
});
console.log(apiClient);

const apiConfig = {
    // Lấy tất cả vaccine
    async getVaccines() {
        try {
            const response = await apiClient.get('/api/vaccines/get-vaccines');
            return response.data;
        } catch (error) {
            console.error('Error details:', error.response || error.message);
            throw new Error('Không thể tải dữ liệu vaccine: ' + error.message);
        }
    },

    // Lấy chi tiết vaccine theo id
    async getVaccineById(id) {
        try {
            const response = await apiClient.get(`/api/vaccines/get-vaccine/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error details:', error.response || error.message);
            throw new Error('Không thể tải chi tiết vaccine: ' + error.message);
        }
    },

    //login
    async login(email, password) {
        try {
            const response = await apiClient.post('/api/auth/login', {
                email,
                password,
            });
            return response.data; // Trả về token
        } catch (error) {
            console.error('Error details:', error.response || error.message);
            throw new Error('Đăng nhập thất bại: ' + (error.response?.data.msg || error.message));
        }
    },
    //register
    async register(name, email, password) {
        try {
            const response = await apiClient.post('/api/auth/register', {
                name,
                email,
                password,
            });
            return response.data; // Trả về token
        } catch (error) {
            console.error('Error details:', error.response || error.message);
            throw new Error('Đăng ký thất bại: ' + (error.response?.data.msg || error.message));
        }
    },
};

export default apiConfig;
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
};

export default apiConfig;
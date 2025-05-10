import axios from 'axios';

// 获取资产类别数据
export async function fetchAssetCategoryData() {
    const response = await axios.get('/api/asset_comparison/');
    return response.data;
}

// 获取时间段数据
export async function fetchTimeDataFromBackend(params) {
    const response = await axios.get('/api/time-data/', { params });
    return response.data;
}

// 获取地区数据
export async function fetchRegionDataFromBackend() {
    const response = await axios.get('/api/region-data/');
    return response.data;
}
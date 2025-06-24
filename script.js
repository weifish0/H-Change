// 等待 DOM 載入完成
document.addEventListener('DOMContentLoaded', function() {
    try {
        // 檢查 Chart.js 是否已載入
        if (typeof Chart === 'undefined') {
            console.error('Chart.js 未載入');
            return;
        }
        
        // 初始化氣溫折線圖
        initTemperatureChart();
        
        // 初始化動態數據更新
        initDynamicData();
        
        // 添加卡片點擊效果
        addCardInteractions();
        
        // Modal 初始化
        initSoilMoistureModal();
        initTemperatureModal();
        initLightModal();
        initCO2Modal();
    } catch (error) {
        console.error('初始化錯誤:', error);
        showErrorMessage('系統初始化失敗，請重新整理頁面');
    }
});

// 顯示錯誤訊息
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 100000;
        font-size: 14px;
        max-width: 300px;
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// 初始化氣溫折線圖
function initTemperatureChart() {
    try {
        const canvas = document.getElementById('temperatureChart');
        if (!canvas) {
            console.error('找不到 temperatureChart canvas 元素');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('無法取得 canvas context');
            return;
        }
        
        // 生成最近7天的日期
        const dates = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            dates.push(date.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' }));
        }
        
        // 模擬氣溫數據（花蓮地區的典型氣溫變化）
        const temperatureData = [22, 24, 26, 25, 23, 24, 24];
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: '氣溫 (°C)',
                    data: temperatureData,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#4CAF50',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#4CAF50',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `氣溫: ${context.parsed.y}°C`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#666',
                            font: {
                                size: 12
                            }
                        }
                    },
                    y: {
                        beginAtZero: false,
                        min: 15,
                        max: 35,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#666',
                            font: {
                                size: 12
                            },
                            callback: function(value) {
                                return value + '°C';
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                elements: {
                    point: {
                        hoverBackgroundColor: '#45a049'
                    }
                }
            }
        });
    } catch (error) {
        console.error('氣溫圖表初始化錯誤:', error);
        showErrorMessage('氣溫圖表載入失敗');
    }
}

// 初始化動態數據更新
function initDynamicData() {
    // 模擬實時數據更新
    setInterval(() => {
        updateSensorData();
    }, 5000); // 每5秒更新一次
    
    // 初始化數據
    updateSensorData();
}

// 更新感測器數據
function updateSensorData() {
    // 模擬真實的感測器數據變化
    const soilMoisture = Math.floor(Math.random() * 20) + 60; // 60-80%
    const temperature = (Math.random() * 6 + 20).toFixed(1); // 20-26°C
    const light = Math.floor(Math.random() * 10000) + 40000; // 40000-50000 lux
    const co2 = Math.floor(Math.random() * 50) + 400; // 400-450 ppm
    
    // 更新顯示
    document.getElementById('soil-moisture').textContent = soilMoisture + '%';
    document.getElementById('temperature').textContent = temperature + '°C';
    document.getElementById('light').textContent = light.toLocaleString() + ' lux';
    document.getElementById('co2').textContent = co2 + ' ppm';
    
    // 更新狀態指示器
    updateStatusIndicators(soilMoisture, temperature, light, co2);
}

// 更新狀態指示器
function updateStatusIndicators(soilMoisture, temperature, light, co2) {
    // 土壤濕度狀態
    const soilStatus = document.querySelector('#soil-moisture').parentNode.querySelector('.card-status');
    if (soilMoisture >= 60 && soilMoisture <= 80) {
        soilStatus.textContent = '良好';
        soilStatus.className = 'card-status good';
    } else if (soilMoisture < 60) {
        soilStatus.textContent = '偏低';
        soilStatus.className = 'card-status normal';
    } else {
        soilStatus.textContent = '偏高';
        soilStatus.className = 'card-status normal';
    }
    
    // 氣溫狀態
    const tempStatus = document.querySelector('#temperature').parentNode.querySelector('.card-status');
    if (temperature >= 20 && temperature <= 28) {
        tempStatus.textContent = '適中';
        tempStatus.className = 'card-status good';
    } else if (temperature < 20) {
        tempStatus.textContent = '偏低';
        tempStatus.className = 'card-status normal';
    } else {
        tempStatus.textContent = '偏高';
        tempStatus.className = 'card-status normal';
    }
    
    // 光照狀態
    const lightStatus = document.querySelector('#light').parentNode.querySelector('.card-status');
    if (light >= 40000 && light <= 60000) {
        lightStatus.textContent = '充足';
        lightStatus.className = 'card-status good';
    } else if (light < 40000) {
        lightStatus.textContent = '不足';
        lightStatus.className = 'card-status normal';
    } else {
        lightStatus.textContent = '過強';
        lightStatus.className = 'card-status normal';
    }
    
    // 二氧化碳狀態
    const co2Status = document.querySelector('#co2').parentNode.querySelector('.card-status');
    if (co2 >= 400 && co2 <= 450) {
        co2Status.textContent = '正常';
        co2Status.className = 'card-status good';
    } else if (co2 > 450) {
        co2Status.textContent = '偏高';
        co2Status.className = 'card-status normal';
    } else {
        co2Status.textContent = '偏低';
        co2Status.className = 'card-status normal';
    }
}

// 添加卡片互動效果
function addCardInteractions() {
    const cards = document.querySelectorAll('.card, .transformation-card');
    
    cards.forEach(card => {
        // 移除點擊事件，只保留鍵盤導航支援
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                // 不執行任何點擊動作
            }
        });
    });
}

// 添加平滑滾動效果
function addSmoothScrolling() {
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// 添加響應式圖表調整
function handleResize() {
    const chartContainer = document.querySelector('.chart-container');
    const chart = document.getElementById('temperatureChart');
    
    if (window.innerWidth <= 768) {
        chartContainer.style.padding = '20px';
        if (chart && chart.chart) {
            chart.chart.resize();
        }
    } else {
        chartContainer.style.padding = '30px';
        if (chart && chart.chart) {
            chart.chart.resize();
        }
    }
}

// 監聽視窗大小變化
window.addEventListener('resize', handleResize);

// 頁面載入完成後初始化所有功能
window.addEventListener('load', function() {
    addSmoothScrolling();
    handleResize();
    
    // 添加載入動畫
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// 添加錯誤處理
window.addEventListener('error', function(e) {
    console.error('Dashboard 錯誤:', e.error);
    
    // 顯示用戶友好的錯誤訊息
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 1000;
        font-size: 14px;
    `;
    errorDiv.textContent = '系統暫時無法載入數據，請稍後再試';
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
});

// Modal 控制與土壤濕度圖表
let soilMoistureChartInstance = null;
let temperatureDetailChartInstance = null;
let lightDistributionChartInstance = null;
let co2TrendChartInstance = null;

function initSoilMoistureModal() {
    const soilCard = document.querySelector('.overview-cards .card');
    const modal = document.getElementById('soil-modal');
    
    // 檢查必要元素是否存在
    if (!soilCard) {
        console.error('找不到土壤濕度卡片元素');
        return;
    }
    
    if (!modal) {
        console.error('找不到土壤濕度 modal 元素');
        return;
    }
    
    const overlay = modal.querySelector('.modal-overlay');
    const closeBtn = document.getElementById('soil-modal-close');
    
    if (!overlay) {
        console.error('找不到土壤濕度 modal overlay 元素');
        return;
    }
    
    if (!closeBtn) {
        console.error('找不到土壤濕度 modal 關閉按鈕');
        return;
    }

    // 點擊卡片開啟 modal
    soilCard.addEventListener('click', function(e) {
        // 避免與卡片動畫衝突
        setTimeout(() => {
            showSoilModal();
        }, 120);
    });
    // 點擊遮罩或關閉按鈕關閉 modal
    overlay.addEventListener('click', hideSoilModal);
    closeBtn.addEventListener('click', hideSoilModal);
    // ESC 鍵關閉
    document.addEventListener('keydown', function(e) {
        if (modal.classList.contains('show') && (e.key === 'Escape' || e.key === 'Esc')) {
            hideSoilModal();
        }
    });
}

function showSoilModal() {
    const modal = document.getElementById('soil-modal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // 隱藏折線圖區塊和轉型預估區塊
    const chartSection = document.querySelector('.chart-section');
    const transformationSection = document.querySelector('.transformation-section');
    if (chartSection) chartSection.style.display = 'none';
    if (transformationSection) transformationSection.style.display = 'none';
    
    // 初始化土壤濕度圖表
    renderSoilMoistureChart();
    // 更新目前濕度與狀態
    updateModalMoistureStatus();
}

function hideSoilModal() {
    const modal = document.getElementById('soil-modal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
    
    // 恢復顯示折線圖區塊和轉型預估區塊
    const chartSection = document.querySelector('.chart-section');
    const transformationSection = document.querySelector('.transformation-section');
    if (chartSection) chartSection.style.display = '';
    if (transformationSection) transformationSection.style.display = '';
    
    // 銷毀圖表
    if (soilMoistureChartInstance) {
        soilMoistureChartInstance.destroy();
        soilMoistureChartInstance = null;
    }
}

function renderSoilMoistureChart() {
    try {
        const canvas = document.getElementById('soilMoistureChart');
        if (!canvas) {
            console.error('找不到 soilMoistureChart canvas 元素');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('無法取得 soilMoistureChart canvas context');
            return;
        }
        
        // 模擬過去7天土壤濕度資料
        const today = new Date();
        const dates = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            dates.push(date.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' }));
        }
        // 模擬數據（可根據實際需求調整）
        const moistures = [42, 45, 47, 44, 41, 39, 40];
        if (soilMoistureChartInstance) soilMoistureChartInstance.destroy();
        soilMoistureChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: '土壤濕度 (%)',
                    data: moistures,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76,175,80,0.08)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#4CAF50',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#4CAF50',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: ctx => `濕度: ${ctx.parsed.y}%`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(0,0,0,0.08)' },
                        ticks: { color: '#666', font: { size: 14 } }
                    },
                    y: {
                        min: 20, max: 80,
                        grid: { color: 'rgba(0,0,0,0.08)' },
                        ticks: {
                            color: '#666', font: { size: 14 },
                            callback: v => v + '%'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('土壤濕度圖表初始化錯誤:', error);
        showErrorMessage('土壤濕度圖表載入失敗');
    }
}

function updateModalMoistureStatus() {
    // 目前濕度（取模擬數據最後一筆）
    const current = 40; // 可改為 moistures[moistures.length-1] 若要同步
    const min = 50, max = 70;
    const valueSpan = document.getElementById('modal-current-moisture');
    const statusSpan = document.getElementById('modal-moisture-status');
    valueSpan.textContent = current + '%';
    if (current < min) {
        statusSpan.textContent = '過乾';
        statusSpan.className = 'moisture-status dry';
    } else if (current > max) {
        statusSpan.textContent = '過濕';
        statusSpan.className = 'moisture-status wet';
    } else {
        statusSpan.textContent = '正常';
        statusSpan.className = 'moisture-status normal';
    }
}

function initTemperatureModal() {
    // 使用更精確的選擇器，選擇第二個卡片（氣溫卡片）
    const cards = document.querySelectorAll('.overview-cards .card');
    const temperatureCard = cards[1]; // 第二個卡片是氣溫卡片
    const modal = document.getElementById('temperature-modal');
    
    // 檢查必要元素是否存在
    if (!temperatureCard) {
        console.error('找不到氣溫卡片元素');
        return;
    }
    
    if (!modal) {
        console.error('找不到氣溫 modal 元素');
        return;
    }
    
    const overlay = modal.querySelector('.modal-overlay');
    const closeBtn = document.getElementById('temperature-modal-close');
    
    if (!overlay) {
        console.error('找不到 modal overlay 元素');
        return;
    }
    
    if (!closeBtn) {
        console.error('找不到 modal 關閉按鈕');
        return;
    }

    // 點擊卡片開啟 modal
    temperatureCard.addEventListener('click', function(e) {
        // 避免與卡片動畫衝突
        setTimeout(() => {
            showTemperatureModal();
        }, 120);
    });
    // 點擊遮罩或關閉按鈕關閉 modal
    overlay.addEventListener('click', hideTemperatureModal);
    closeBtn.addEventListener('click', hideTemperatureModal);
    // ESC 鍵關閉
    document.addEventListener('keydown', function(e) {
        if (modal.classList.contains('show') && (e.key === 'Escape' || e.key === 'Esc')) {
            hideTemperatureModal();
        }
    });
}

function showTemperatureModal() {
    const modal = document.getElementById('temperature-modal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // 隱藏折線圖區塊和轉型預估區塊
    const chartSection = document.querySelector('.chart-section');
    const transformationSection = document.querySelector('.transformation-section');
    if (chartSection) chartSection.style.display = 'none';
    if (transformationSection) transformationSection.style.display = 'none';
    
    // 初始化氣溫詳情圖表
    renderTemperatureDetailChart();
}

function hideTemperatureModal() {
    const modal = document.getElementById('temperature-modal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
    
    // 恢復顯示折線圖區塊和轉型預估區塊
    const chartSection = document.querySelector('.chart-section');
    const transformationSection = document.querySelector('.transformation-section');
    if (chartSection) chartSection.style.display = '';
    if (transformationSection) transformationSection.style.display = '';
    
    // 銷毀圖表
    if (temperatureDetailChartInstance) {
        temperatureDetailChartInstance.destroy();
        temperatureDetailChartInstance = null;
    }
}

function renderTemperatureDetailChart() {
    try {
        const canvas = document.getElementById('temperatureDetailChart');
        if (!canvas) {
            console.error('找不到 temperatureDetailChart canvas 元素');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('無法取得 temperatureDetailChart canvas context');
            return;
        }
        
        // 模擬過去7天氣溫資料
        const today = new Date();
        const dates = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            dates.push(date.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' }));
        }
        // 模擬數據（花蓮地區的典型氣溫變化，包含日夜溫差）
        const temperatures = [22, 26, 28, 25, 24, 27, 24];
        if (temperatureDetailChartInstance) temperatureDetailChartInstance.destroy();
        temperatureDetailChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: '氣溫 (°C)',
                    data: temperatures,
                    borderColor: '#FF9800',
                    backgroundColor: 'rgba(255,152,0,0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#FF9800',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#FF9800',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: ctx => `氣溫: ${ctx.parsed.y}°C`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(0,0,0,0.08)' },
                        ticks: { color: '#666', font: { size: 14 } }
                    },
                    y: {
                        min: 15, max: 35,
                        grid: { color: 'rgba(0,0,0,0.08)' },
                        ticks: {
                            color: '#666', font: { size: 14 },
                            callback: v => v + '°C'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('氣溫詳情圖表初始化錯誤:', error);
        showErrorMessage('氣溫詳情圖表載入失敗');
    }
}

function initLightModal() {
    // 使用更精確的選擇器，選擇第三個卡片（光照卡片）
    const cards = document.querySelectorAll('.overview-cards .card');
    const lightCard = cards[2]; // 第三個卡片是光照卡片
    const modal = document.getElementById('light-modal');
    
    // 檢查必要元素是否存在
    if (!lightCard) {
        console.error('找不到光照卡片元素');
        return;
    }
    
    if (!modal) {
        console.error('找不到光照 modal 元素');
        return;
    }
    
    const overlay = modal.querySelector('.modal-overlay');
    const closeBtn = document.getElementById('light-modal-close');
    
    if (!overlay) {
        console.error('找不到光照 modal overlay 元素');
        return;
    }
    
    if (!closeBtn) {
        console.error('找不到光照 modal 關閉按鈕');
        return;
    }

    // 點擊卡片開啟 modal
    lightCard.addEventListener('click', function(e) {
        // 避免與卡片動畫衝突
        setTimeout(() => {
            showLightModal();
        }, 120);
    });
    // 點擊遮罩或關閉按鈕關閉 modal
    overlay.addEventListener('click', hideLightModal);
    closeBtn.addEventListener('click', hideLightModal);
    // ESC 鍵關閉
    document.addEventListener('keydown', function(e) {
        if (modal.classList.contains('show') && (e.key === 'Escape' || e.key === 'Esc')) {
            hideLightModal();
        }
    });
}

function showLightModal() {
    const modal = document.getElementById('light-modal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // 隱藏折線圖區塊和轉型預估區塊
    const chartSection = document.querySelector('.chart-section');
    const transformationSection = document.querySelector('.transformation-section');
    if (chartSection) chartSection.style.display = 'none';
    if (transformationSection) transformationSection.style.display = 'none';
    
    // 初始化光照分佈圖表
    renderLightDistributionChart();
    // 更新光照效率狀態
    updateLightEfficiencyStatus();
}

function hideLightModal() {
    const modal = document.getElementById('light-modal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
    
    // 恢復顯示折線圖區塊和轉型預估區塊
    const chartSection = document.querySelector('.chart-section');
    const transformationSection = document.querySelector('.transformation-section');
    if (chartSection) chartSection.style.display = '';
    if (transformationSection) transformationSection.style.display = '';
    
    // 銷毀圖表
    if (lightDistributionChartInstance) {
        lightDistributionChartInstance.destroy();
        lightDistributionChartInstance = null;
    }
}

function renderLightDistributionChart() {
    try {
        const canvas = document.getElementById('lightDistributionChart');
        if (!canvas) {
            console.error('找不到 lightDistributionChart canvas 元素');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('無法取得 lightDistributionChart canvas context');
            return;
        }
        
        // 模擬早中晚光照強度數據
        const timeLabels = ['早上 6:00', '早上 9:00', '中午 12:00', '下午 3:00', '下午 6:00'];
        const lightIntensities = [15000, 35000, 65000, 45000, 20000];
        
        if (lightDistributionChartInstance) lightDistributionChartInstance.destroy();
        lightDistributionChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: timeLabels,
                datasets: [{
                    label: '光照強度 (lux)',
                    data: lightIntensities,
                    backgroundColor: [
                        'rgba(255, 193, 7, 0.8)',   // 早上 - 黃色
                        'rgba(255, 152, 0, 0.8)',   // 上午 - 橙色
                        'rgba(244, 67, 54, 0.8)',   // 中午 - 紅色（過強）
                        'rgba(255, 152, 0, 0.8)',   // 下午 - 橙色
                        'rgba(255, 193, 7, 0.8)'    // 傍晚 - 黃色
                    ],
                    borderColor: [
                        '#FFC107',
                        '#FF9800',
                        '#F44336',
                        '#FF9800',
                        '#FFC107'
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#FF9800',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: ctx => `光照強度: ${ctx.parsed.y.toLocaleString()} lux`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(0,0,0,0.08)' },
                        ticks: { color: '#666', font: { size: 14 } }
                    },
                    y: {
                        beginAtZero: true,
                        max: 80000,
                        grid: { color: 'rgba(0,0,0,0.08)' },
                        ticks: {
                            color: '#666', font: { size: 14 },
                            callback: v => (v / 1000).toFixed(0) + 'k'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('光照分佈圖表初始化錯誤:', error);
        showErrorMessage('光照分佈圖表載入失敗');
    }
}

function updateLightEfficiencyStatus() {
    // 目前光照強度（取中午的數據）
    const current = 65000; // 中午光照強度
    const valueSpan = document.getElementById('modal-current-light');
    const efficiencySpan = document.getElementById('modal-light-efficiency');
    
    valueSpan.textContent = current.toLocaleString() + ' lux';
    
    // 判斷光照效率
    if (current < 20000) {
        efficiencySpan.textContent = '不足';
        efficiencySpan.className = 'light-efficiency insufficient';
    } else if (current > 50000) {
        efficiencySpan.textContent = '過強';
        efficiencySpan.className = 'light-efficiency excessive';
    } else {
        efficiencySpan.textContent = '適中';
        efficiencySpan.className = 'light-efficiency optimal';
    }
}

function initCO2Modal() {
    // 使用更精確的選擇器，選擇第四個卡片（CO₂ 濃度卡片）
    const cards = document.querySelectorAll('.overview-cards .card');
    const co2Card = cards[3]; // 第四個卡片是 CO₂ 濃度卡片
    const modal = document.getElementById('co2-modal');
    
    // 檢查必要元素是否存在
    if (!co2Card) {
        console.error('找不到 CO₂ 濃度卡片元素');
        return;
    }
    
    if (!modal) {
        console.error('找不到 CO₂ modal 元素');
        return;
    }
    
    const overlay = modal.querySelector('.modal-overlay');
    const closeBtn = document.getElementById('co2-modal-close');
    
    if (!overlay) {
        console.error('找不到 CO₂ modal overlay 元素');
        return;
    }
    
    if (!closeBtn) {
        console.error('找不到 CO₂ modal 關閉按鈕');
        return;
    }

    // 點擊卡片開啟 modal
    co2Card.addEventListener('click', function(e) {
        // 避免與卡片動畫衝突
        setTimeout(() => {
            showCO2Modal();
        }, 120);
    });
    // 點擊遮罩或關閉按鈕關閉 modal
    overlay.addEventListener('click', hideCO2Modal);
    closeBtn.addEventListener('click', hideCO2Modal);
    // ESC 鍵關閉
    document.addEventListener('keydown', function(e) {
        if (modal.classList.contains('show') && (e.key === 'Escape' || e.key === 'Esc')) {
            hideCO2Modal();
        }
    });
}

function showCO2Modal() {
    const modal = document.getElementById('co2-modal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // 隱藏折線圖區塊和轉型預估區塊
    const chartSection = document.querySelector('.chart-section');
    const transformationSection = document.querySelector('.transformation-section');
    if (chartSection) chartSection.style.display = 'none';
    if (transformationSection) transformationSection.style.display = 'none';
    
    // 初始化 CO₂ 濃度趨勢圖表
    renderCO2TrendChart();
    // 更新 CO₂ 濃度狀態
    updateCO2ConcentrationStatus();
}

function hideCO2Modal() {
    const modal = document.getElementById('co2-modal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
    
    // 恢復顯示折線圖區塊和轉型預估區塊
    const chartSection = document.querySelector('.chart-section');
    const transformationSection = document.querySelector('.transformation-section');
    if (chartSection) chartSection.style.display = '';
    if (transformationSection) transformationSection.style.display = '';
    
    // 銷毀圖表
    if (co2TrendChartInstance) {
        co2TrendChartInstance.destroy();
        co2TrendChartInstance = null;
    }
}

function renderCO2TrendChart() {
    try {
        const canvas = document.getElementById('co2TrendChart');
        if (!canvas) {
            console.error('找不到 co2TrendChart canvas 元素');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('無法取得 co2TrendChart canvas context');
            return;
        }
        
        // 模擬過去7天 CO₂ 濃度數據
        const today = new Date();
        const dates = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            dates.push(date.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' }));
        }
        // 模擬數據（有機農業環境的 CO₂ 濃度變化）
        const co2Levels = [380, 375, 370, 365, 370, 375, 370];
        
        if (co2TrendChartInstance) co2TrendChartInstance.destroy();
        co2TrendChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'CO₂ 濃度 (ppm)',
                    data: co2Levels,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76,175,80,0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#4CAF50',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#4CAF50',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: ctx => `CO₂ 濃度: ${ctx.parsed.y} ppm`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(0,0,0,0.08)' },
                        ticks: { color: '#666', font: { size: 14 } }
                    },
                    y: {
                        min: 350, max: 450,
                        grid: { color: 'rgba(0,0,0,0.08)' },
                        ticks: {
                            color: '#666', font: { size: 14 },
                            callback: v => v + ' ppm'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('CO₂ 濃度趨勢圖表初始化錯誤:', error);
        showErrorMessage('CO₂ 濃度趨勢圖表載入失敗');
    }
}

function updateCO2ConcentrationStatus() {
    // 目前 CO₂ 濃度（取模擬數據最後一筆）
    const current = 370; // ppm
    const min = 400, max = 600;
    const valueSpan = document.getElementById('modal-current-co2');
    const statusSpan = document.getElementById('modal-co2-status');
    
    valueSpan.textContent = current + ' ppm';
    
    // 判斷 CO₂ 濃度狀態
    if (current < min) {
        statusSpan.textContent = '偏低';
        statusSpan.className = 'co2-status low';
    } else if (current > max) {
        statusSpan.textContent = '偏高';
        statusSpan.className = 'co2-status high';
    } else {
        statusSpan.textContent = '適中';
        statusSpan.className = 'co2-status optimal';
    }
} 
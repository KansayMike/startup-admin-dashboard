// StartupFlow Dashboard JavaScript
class DashboardManager {
    constructor() {
        this.charts = {};
        this.data = this.generateMockData();
        this.init();
    }

    init() {
        this.initParticles();
        this.initAnimations();
        this.initCharts();
        this.initEventListeners();
        this.initRevealAnimations();
        this.startRealTimeUpdates();
    }

    // Generate realistic SaaS mock data
    generateMockData() {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const revenueData = [];
        const userGrowthData = [];
        const newUsersData = [];
        
        let baseRevenue = 85000;
        let baseUsers = 1800;
        
        for (let i = 0; i < 12; i++) {
            // Revenue growth with some volatility
            const growthRate = 1 + (Math.random() * 0.15 + 0.05); // 5-20% growth
            baseRevenue = Math.floor(baseRevenue * growthRate);
            revenueData.push(baseRevenue);
            
            // User growth
            const userGrowth = Math.floor(Math.random() * 200 + 50); // 50-250 new users
            baseUsers += userGrowth;
            userGrowthData.push(baseUsers);
            newUsersData.push(userGrowth);
        }

        return {
            months,
            revenue: revenueData,
            users: userGrowthData,
            newUsers: newUsersData,
            metrics: {
                mrr: 124580,
                activeUsers: 2847,
                churnRate: 2.4,
                cac: 186
            }
        };
    }

    // Initialize particle background
    initParticles() {
        if (typeof p5 !== 'undefined') {
            new p5((sketch) => {
                let particles = [];
                
                sketch.setup = () => {
                    const canvas = sketch.createCanvas(
                        document.getElementById('particle-container').offsetWidth,
                        document.getElementById('particle-container').offsetHeight
                    );
                    canvas.parent('particle-container');
                    
                    // Create particles
                    for (let i = 0; i < 50; i++) {
                        particles.push({
                            x: sketch.random(sketch.width),
                            y: sketch.random(sketch.height),
                            vx: sketch.random(-0.5, 0.5),
                            vy: sketch.random(-0.5, 0.5),
                            size: sketch.random(1, 3),
                            opacity: sketch.random(0.1, 0.3)
                        });
                    }
                };
                
                sketch.draw = () => {
                    sketch.clear();
                    
                    particles.forEach(particle => {
                        // Update position
                        particle.x += particle.vx;
                        particle.y += particle.vy;
                        
                        // Wrap around edges
                        if (particle.x < 0) particle.x = sketch.width;
                        if (particle.x > sketch.width) particle.x = 0;
                        if (particle.y < 0) particle.y = sketch.height;
                        if (particle.y > sketch.height) particle.y = 0;
                        
                        // Draw particle
                        sketch.fill(255, 255, 255, particle.opacity * 255);
                        sketch.noStroke();
                        sketch.circle(particle.x, particle.y, particle.size);
                    });
                };
                
                sketch.windowResized = () => {
                    sketch.resizeCanvas(
                        document.getElementById('particle-container').offsetWidth,
                        document.getElementById('particle-container').offsetHeight
                    );
                };
            });
        }
    }

    // Initialize text animations
    initAnimations() {
        if (typeof Splitting !== 'undefined') {
            Splitting();
            
            // Animate hero text
            anime({
                targets: '[data-splitting] .char',
                translateY: [100, 0],
                opacity: [0, 1],
                easing: 'easeOutExpo',
                duration: 1400,
                delay: anime.stagger(30)
            });
        }
    }

    // Initialize charts
    initCharts() {
        this.initRevenueChart();
        this.initUserGrowthChart();
    }

    initRevenueChart() {
        const chartDom = document.getElementById('revenueChart');
        if (!chartDom) return;
        
        this.charts.revenue = echarts.init(chartDom);
        
        const option = {
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: '#e2e8f0',
                textStyle: { color: '#334155' }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: this.data.months,
                axisLine: { lineStyle: { color: '#e2e8f0' } },
                axisTick: { lineStyle: { color: '#e2e8f0' } },
                axisLabel: { color: '#64748b' }
            },
            yAxis: {
                type: 'value',
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { 
                    color: '#64748b',
                    formatter: (value) => '$' + (value / 1000) + 'K'
                },
                splitLine: { lineStyle: { color: '#f1f5f9' } }
            },
            series: [{
                name: 'Revenue',
                type: 'line',
                data: this.data.revenue,
                smooth: true,
                lineStyle: { color: '#10b981', width: 3 },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
                            { offset: 1, color: 'rgba(16, 185, 129, 0.05)' }
                        ]
                    }
                },
                itemStyle: { color: '#10b981' },
                emphasis: {
                    itemStyle: { borderWidth: 3, borderColor: '#ffffff' }
                }
            }]
        };
        
        this.charts.revenue.setOption(option);
    }

    initUserGrowthChart() {
        const chartDom = document.getElementById('userGrowthChart');
        if (!chartDom) return;
        
        this.charts.userGrowth = echarts.init(chartDom);
        
        const option = {
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: '#e2e8f0',
                textStyle: { color: '#334155' }
            },
            legend: {
                data: ['New Users', 'Total Users'],
                bottom: 0,
                textStyle: { color: '#64748b' }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: this.data.months,
                axisLine: { lineStyle: { color: '#e2e8f0' } },
                axisTick: { lineStyle: { color: '#e2e8f0' } },
                axisLabel: { color: '#64748b' }
            },
            yAxis: {
                type: 'value',
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { color: '#64748b' },
                splitLine: { lineStyle: { color: '#f1f5f9' } }
            },
            series: [
                {
                    name: 'New Users',
                    type: 'bar',
                    data: this.data.newUsers,
                    itemStyle: { color: '#3b82f6' },
                    barWidth: '40%'
                },
                {
                    name: 'Total Users',
                    type: 'line',
                    data: this.data.users,
                    smooth: true,
                    lineStyle: { color: '#10b981', width: 3 },
                    itemStyle: { color: '#10b981' }
                }
            ]
        };
        
        this.charts.userGrowth.setOption(option);
    }

    // Initialize event listeners
    initEventListeners() {
        // Date range selector
        const dateRange = document.getElementById('dateRange');
        if (dateRange) {
            dateRange.addEventListener('change', (e) => {
                this.updateChartsForDateRange(e.target.value);
            });
        }

        // Refresh data button
        const refreshBtn = document.getElementById('refreshData');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshDashboard();
            });
        }

        // Chart type switchers
        const lineChartBtn = document.getElementById('lineChart');
        const barChartBtn = document.getElementById('barChart');
        
        if (lineChartBtn) {
            lineChartBtn.addEventListener('click', () => {
                this.switchChartType('line');
                this.updateChartButtons(lineChartBtn, barChartBtn);
            });
        }
        
        if (barChartBtn) {
            barChartBtn.addEventListener('click', () => {
                this.switchChartType('bar');
                this.updateChartButtons(barChartBtn, lineChartBtn);
            });
        }

        // Quick action buttons
        const quickActionBtns = document.querySelectorAll('.quick-action');
        quickActionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Resize charts on window resize
        window.addEventListener('resize', () => {
            Object.values(this.charts).forEach(chart => {
                if (chart && chart.resize) {
                    chart.resize();
                }
            });
        });
    }

    // Initialize reveal animations
    initRevealAnimations() {
        const revealElements = document.querySelectorAll('.reveal');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });
        
        revealElements.forEach(el => observer.observe(el));
    }

    // Update chart type
    switchChartType(type) {
        if (!this.charts.revenue) return;
        
        const option = this.charts.revenue.getOption();
        option.series[0].type = type;
        
        if (type === 'bar') {
            option.series[0].itemStyle = { color: '#10b981' };
            option.series[0].barWidth = '60%';
            delete option.series[0].areaStyle;
        } else {
            option.series[0].lineStyle = { color: '#10b981', width: 3 };
            option.series[0].areaStyle = {
                color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                        { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
                        { offset: 1, color: 'rgba(16, 185, 129, 0.05)' }
                    ]
                }
            };
        }
        
        this.charts.revenue.setOption(option);
    }

    // Update chart button states
    updateChartButtons(activeBtn, inactiveBtn) {
        activeBtn.classList.add('bg-emerald-500', 'text-white');
        activeBtn.classList.remove('text-slate-600', 'hover:bg-gray-100');
        
        inactiveBtn.classList.remove('bg-emerald-500', 'text-white');
        inactiveBtn.classList.add('text-slate-600', 'hover:bg-gray-100');
    }

    // Update charts based on date range
    updateChartsForDateRange(range) {
        // Simulate different data for different date ranges
        const multiplier = range === '7d' ? 0.3 : range === '90d' ? 1.5 : range === '1y' ? 2.2 : 1;
        
        const updatedRevenue = this.data.revenue.map(val => Math.floor(val * multiplier));
        
        if (this.charts.revenue) {
            const option = this.charts.revenue.getOption();
            option.series[0].data = updatedRevenue;
            this.charts.revenue.setOption(option);
        }
        
        // Show loading animation
        this.showLoadingState();
        
        setTimeout(() => {
            this.hideLoadingState();
        }, 1000);
    }

    // Refresh dashboard data
    refreshDashboard() {
        this.showLoadingState();
        
        // Simulate API call
        setTimeout(() => {
            // Update metrics with small random changes
            const mrrElement = document.getElementById('mrrValue');
            const usersElement = document.getElementById('usersValue');
            const churnElement = document.getElementById('churnValue');
            const cacElement = document.getElementById('cacValue');
            
            if (mrrElement) {
                const newMrr = this.data.metrics.mrr + Math.floor(Math.random() * 2000 - 1000);
                mrrElement.textContent = '$' + newMrr.toLocaleString();
            }
            
            if (usersElement) {
                const newUsers = this.data.metrics.activeUsers + Math.floor(Math.random() * 100 - 50);
                usersElement.textContent = newUsers.toLocaleString();
            }
            
            // Update charts with new data
            this.updateChartsWithNewData();
            this.hideLoadingState();
            
            // Show success notification
            this.showNotification('Dashboard updated successfully', 'success');
        }, 1500);
    }

    // Update charts with new data
    updateChartsWithNewData() {
        if (this.charts.revenue) {
            const newRevenue = this.data.revenue.map(val => 
                val + Math.floor(Math.random() * 5000 - 2500)
            );
            
            const option = this.charts.revenue.getOption();
            option.series[0].data = newRevenue;
            this.charts.revenue.setOption(option);
        }
    }

    // Handle quick actions
    handleQuickAction(action) {
        switch (action) {
            case 'addUser':
                window.location.href = 'users.html#add';
                break;
            case 'viewReports':
                this.showNotification('Reports feature coming soon!', 'info');
                break;
            case 'systemSettings':
                window.location.href = 'settings.html';
                break;
            default:
                this.showNotification('Action not implemented yet', 'info');
        }
    }

    // Show loading state
    showLoadingState() {
        const elements = document.querySelectorAll('.metric-card');
        elements.forEach(el => {
            el.classList.add('loading-skeleton');
        });
    }

    // Hide loading state
    hideLoadingState() {
        const elements = document.querySelectorAll('.metric-card');
        elements.forEach(el => {
            el.classList.remove('loading-skeleton');
        });
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-emerald-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        anime({
            targets: notification,
            translateX: [300, 0],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutQuart'
        });
        
        // Remove after 3 seconds
        setTimeout(() => {
            anime({
                targets: notification,
                translateX: [0, 300],
                opacity: [1, 0],
                duration: 300,
                easing: 'easeInQuart',
                complete: () => {
                    document.body.removeChild(notification);
                }
            });
        }, 3000);
    }

    // Start real-time updates
    startRealTimeUpdates() {
        // Simulate real-time data updates every 30 seconds
        setInterval(() => {
            this.updateMetricsRealTime();
        }, 30000);
    }

    // Update metrics in real-time
    updateMetricsRealTime() {
        const smallChange = Math.random() * 0.02 - 0.01; // -1% to +1% change
        
        // Update MRR
        const mrrElement = document.getElementById('mrrValue');
        if (mrrElement) {
            const currentValue = parseInt(mrrElement.textContent.replace(/[$,]/g, ''));
            const newValue = Math.floor(currentValue * (1 + smallChange));
            mrrElement.textContent = '$' + newValue.toLocaleString();
        }
        
        // Update active users
        const usersElement = document.getElementById('usersValue');
        if (usersElement) {
            const currentValue = parseInt(usersElement.textContent.replace(/,/g, ''));
            const newValue = Math.floor(currentValue * (1 + smallChange));
            usersElement.textContent = newValue.toLocaleString();
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DashboardManager();
});

// Utility functions for other pages
window.DashboardUtils = {
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-emerald-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    },
    
    formatCurrency: function(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },
    
    formatNumber: function(number) {
        return new Intl.NumberFormat('en-US').format(number);
    },
    
    generateId: function() {
        return Math.random().toString(36).substr(2, 9);
    }
};
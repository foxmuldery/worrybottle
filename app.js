// 主应用类
class WorryBottleApp {
    constructor() {
        this.currentScreen = 'home-screen';
        this.worryData = {
            title: '',
            content: '',
            emotion: '',
            intensity: 3,
            bottleType: 'classic',
            sealDays: 7
        };
        this.currentBottle = null;
        this.resealDays = 7;
        
        this.initializeApp();
        this.attachEventListeners();
    }
    
    // 初始化应用
    initializeApp() {
        console.log("烦恼瓶子应用已初始化");
        this.checkLocalStorage();
        this.updateBottleStatus();
    }
    
    // 检查本地存储
    checkLocalStorage() {
        if (!localStorage.getItem('worryBottles')) {
            localStorage.setItem('worryBottles', JSON.stringify([]));
        }
    }
    
    // 更新瓶子状态
    updateBottleStatus() {
        const bottles = JSON.parse(localStorage.getItem('worryBottles'));
        const now = new Date().toISOString();
        
        let updated = false;
        
        bottles.forEach(bottle => {
            // 检查是否需要更新状态
            if (bottle.status === 'sealed' && bottle.sealUntil <= now) {
                bottle.status = 'openable';
                updated = true;
            }
        });
        
        if (updated) {
            localStorage.setItem('worryBottles', JSON.stringify(bottles));
        }
    }
    
    // 绑定事件监听器
    attachEventListeners() {
       
        // 在 attachEventListeners 方法中添加
        document.getElementById('early-open-btn').addEventListener('click', () => {
            this.confirmEarlyOpen();
        });
        
        document.getElementById('view-growth-btn').addEventListener('click', () => {
        this.viewGrowthInsights();
        });
        // 主页按钮
        document.getElementById('create-worry-btn').addEventListener('click', () => {
            this.navigateTo('create-worry-screen');
        });
        
        document.getElementById('view-bottles-btn').addEventListener('click', () => {
            this.loadBottles();
            this.navigateTo('bottle-list-screen');
        });
        
        // 返回按钮
        document.getElementById('create-back-btn').addEventListener('click', () => {
            this.navigateTo('home-screen');
        });
        
        document.getElementById('seal-back-btn').addEventListener('click', () => {
            this.navigateTo('create-worry-screen');
        });
        
        document.getElementById('list-back-btn').addEventListener('click', () => {
            this.navigateTo('home-screen');
        });
        
        document.getElementById('detail-back-btn').addEventListener('click', () => {
            this.navigateTo('bottle-list-screen');
        });
        
        // 创建烦恼表单
        document.getElementById('worry-content').addEventListener('input', (e) => {
            const charCount = e.target.value.length;
            document.getElementById('char-count').textContent = charCount;
            // 更新数据
            this.worryData.content = e.target.value;
        });
        
        document.getElementById('worry-title').addEventListener('input', (e) => {
            this.worryData.title = e.target.value;
        });
        
        document.getElementById('worry-intensity').addEventListener('input', (e) => {
            this.worryData.intensity = parseInt(e.target.value);
        });
        
        // 情绪选择
        const emotions = document.querySelectorAll('.emotion');
        emotions.forEach(emotion => {
            emotion.addEventListener('click', () => {
                // 移除其他选中状态
                emotions.forEach(e => e.classList.remove('selected'));
                // 添加选中状态
                emotion.classList.add('selected');
                // 更新数据
                this.worryData.emotion = emotion.dataset.emotion;
            });
        });
        
        // 继续按钮
        document.getElementById('continue-to-seal-btn').addEventListener('click', () => {
            if (this.validateWorryForm()) {
                this.navigateTo('seal-worry-screen');
            }
        });
        
        // 瓶子选择
        const bottles = document.querySelectorAll('.bottle');
        bottles.forEach(bottle => {
            bottle.addEventListener('click', () => {
                // 移除其他选中状态
                bottles.forEach(b => b.classList.remove('selected'));
                // 添加选中状态
                bottle.classList.add('selected');
                // 更新数据
                this.worryData.bottleType = bottle.dataset.bottle;
                // 更新预览
                const selectedBottle = document.getElementById('selected-bottle');
                selectedBottle.className = `bottle-image ${this.worryData.bottleType}-bottle`;
            });
        });
        
        // 时间选择
        const timeOptions = document.querySelectorAll('.time-option');
        timeOptions.forEach(option => {
            option.addEventListener('click', () => {
                // 移除其他选中状态
                timeOptions.forEach(o => o.classList.remove('selected'));
                // 添加选中状态
                option.classList.add('selected');
                
                // 处理自定义时间
                const customTimeInput = document.getElementById('custom-time-input');
                if (option.dataset.days === 'custom') {
                    customTimeInput.classList.remove('hidden');
                    this.worryData.sealDays = parseInt(document.getElementById('custom-days').value);
                } else {
                    customTimeInput.classList.add('hidden');
                    this.worryData.sealDays = parseInt(option.dataset.days);
                }
            });
        });
        
        // 自定义天数输入
        document.getElementById('custom-days').addEventListener('input', (e) => {
            this.worryData.sealDays = parseInt(e.target.value);
        });
        
        // 封存按钮
        document.getElementById('seal-worry-btn').addEventListener('click', () => {
            this.sealWorry();
        });
        
        // 瓶子列表标签切换
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(tab => {
            tab.addEventListener('click', () => {
                // 移除其他选中状态
                tabButtons.forEach(t => t.classList.remove('active'));
                // 添加选中状态
                tab.classList.add('active');
                
                // 切换内容区域
                const tabId = tab.dataset.tab;
                document.querySelectorAll('.bottle-tab').forEach(tabContent => {
                    tabContent.classList.remove('active');
                });
                document.getElementById(`${tabId}-bottles`).classList.add('active');
            });
        });
        
        // 打开瓶子按钮
        document.getElementById('open-bottle-btn').addEventListener('click', () => {
            this.openBottle();
        });
        
        // 烦恼已消除按钮
        document.getElementById('worry-gone-btn').addEventListener('click', () => {
            this.handleWorryGone();
        });
        
        // 烦恼仍存在按钮
        document.getElementById('worry-remains-btn').addEventListener('click', () => {
            this.handleWorryRemains();
        });
        
        // 保存感悟按钮
        document.getElementById('save-reflection-btn').addEventListener('click', () => {
            this.saveReflection();
        });
        
        // 重新封存时间选择
        const resealTimeOptions = document.querySelectorAll('.reseal-time-selector .time-option');
        resealTimeOptions.forEach(option => {
            option.addEventListener('click', () => {
                // 移除其他选中状态
                resealTimeOptions.forEach(o => o.classList.remove('selected'));
                // 添加选中状态
                option.classList.add('selected');
                // 更新数据
                this.resealDays = parseInt(option.dataset.days);
            });
        });
        
        // 确认重新封存按钮
        document.getElementById('reseal-confirm-btn').addEventListener('click', () => {
            this.resealBottle();
        });
    }
    
    // 验证烦恼表单
    validateWorryForm() {
        if (!this.worryData.content.trim()) {
            alert('请描述你的烦恼');
            return false;
        }
        
        if (this.worryData.content.length > 500) {
            alert('烦恼描述不能超过500字');
            return false;
        }
        
        if (!this.worryData.emotion) {
            alert('请选择一种情绪');
            return false;
        }
        
        return true;
    }
    
    // 封存烦恼
    sealWorry() {
        // 创建新的烦恼瓶子对象
        const newBottle = {
            id: Date.now().toString(),
            title: this.worryData.title || '未命名烦恼',
            content: this.worryData.content,
            emotion: this.worryData.emotion,
            intensity: this.worryData.intensity,
            bottleType: this.worryData.bottleType,
            createdAt: new Date().toISOString(),
            sealUntil: new Date(Date.now() + this.worryData.sealDays * 24 * 60 * 60 * 1000).toISOString(),
            status: 'sealed',
            reflections: [],
            resealCount: 0
        };
        
        // 获取现有瓶子
        const bottles = JSON.parse(localStorage.getItem('worryBottles'));
        
        // 添加新瓶子
        bottles.push(newBottle);
        
        // 保存回本地存储
        localStorage.setItem('worryBottles', JSON.stringify(bottles));
        
        // 显示动画并返回主页
        BottleAnimations.sealAnimation(this.worryData.bottleType, this.worryData.content)
            .then(() => {
                // 重置表单数据
                this.resetWorryForm();
                
                // 返回主页
                this.navigateTo('home-screen');
            });
    }
    
    // 重置表单数据
    resetWorryForm() {
        // 重置数据对象
        this.worryData = {
            title: '',
            content: '',
            emotion: '',
            intensity: 3,
            bottleType: 'classic',
            sealDays: 7
        };
        
        // 重置表单元素
        document.getElementById('worry-title').value = '';
        document.getElementById('worry-content').value = '';
        document.getElementById('char-count').textContent = '0';
        document.getElementById('worry-intensity').value = 3;
        
        // 重置情绪选择
        document.querySelectorAll('.emotion').forEach(e => e.classList.remove('selected'));
        
        // 重置瓶子选择
        document.querySelectorAll('.bottle').forEach(b => b.classList.remove('selected'));
        document.querySelector('.bottle[data-bottle="classic"]').classList.add('selected');
        
        // 重置时间选择
        document.querySelectorAll('.time-option').forEach(o => o.classList.remove('selected'));
        document.querySelector('.time-option[data-days="7"]').classList.add('selected');
        document.getElementById('custom-time-input').classList.add('hidden');
    }
    
// 查看成长感悟
viewGrowthInsights() {
    // 加载瓶子数据
    this.loadBottles();
    
    // 导航到瓶子列表页面
    this.navigateTo('bottle-list-screen');
    
    // 激活"已解决"标签
    document.querySelectorAll('.tab-btn').forEach(tab => tab.classList.remove('active'));
    document.querySelector('.tab-btn[data-tab="resolved"]').classList.add('active');
    
    // 显示已解决的瓶子
    document.querySelectorAll('.bottle-tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById('resolved-bottles').classList.add('active');
}

    
    // 加载瓶子列表
    loadBottles() {
        // 更新瓶子状态
        this.updateBottleStatus();
        
        // 获取所有瓶子
        const bottles = JSON.parse(localStorage.getItem('worryBottles'));
        
        // 分类瓶子
        const sealed = bottles.filter(b => b.status === 'sealed');
        const openable = bottles.filter(b => b.status === 'openable');
        const resolved = bottles.filter(b => b.status === 'resolved');
        
        // 更新计数
        document.getElementById('sealed-count').textContent = sealed.length;
        document.getElementById('openable-count').textContent = openable.length;
        document.getElementById('resolved-count').textContent = resolved.length;
        
        // 渲染各类瓶子
        this.renderBottleList('sealed-bottles', sealed, '没有正在等待的烦恼瓶子');
        this.renderBottleList('openable-bottles', openable, '没有可以打开的烦恼瓶子');
        this.renderBottleList('resolved-bottles', resolved, '没有已解决的烦恼瓶子');
    }
    
// 渲染瓶子列表
renderBottleList(containerId, bottles, emptyMessage) {
    const container = document.getElementById(containerId);
    
    // 清空容器
    container.innerHTML = '';
    
    // 检查是否为空
    if (bottles.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="material-icons">${this.getEmptyStateIcon(containerId)}</span>
                <p>${emptyMessage}</p>
            </div>
        `;
        return;
    }
    
    // 添加瓶子卡片
    bottles.forEach(bottle => {
        const card = document.createElement('div');
        card.className = 'bottle-card';
        card.dataset.id = bottle.id;
        
        // 格式化日期
        const createdDate = new Date(bottle.createdAt);
        const formattedDate = `${createdDate.getFullYear()}年${createdDate.getMonth() + 1}月${createdDate.getDate()}日`;
        
        // 计算剩余时间
        let timeInfo = '';
        if (bottle.status === 'sealed') {
            const now = new Date();
            const sealUntil = new Date(bottle.sealUntil);
            const daysLeft = Math.ceil((sealUntil - now) / (1000 * 60 * 60 * 24));
            timeInfo = `<div class="countdown">还剩 ${daysLeft} 天</div>`;
        }
        
        // 设置瓶子样式
        let bottleClass = `bottle-image ${bottle.bottleType}-bottle`;
        if (bottle.status === 'openable') {
            bottleClass += ' glow';
        }
        
        // 设置情绪标签
        const emotionLabel = this.getEmotionLabel(bottle.emotion);
        
        // 添加提前打开按钮
        let earlyOpenButton = '';
        if (bottle.status === 'sealed') {
            earlyOpenButton = `
                <button class="early-open-list-btn" data-id="${bottle.id}">
                    <span class="material-icons">lock_open</span>
                </button>
            `;
        }
        
        card.innerHTML = `
            <div class="${bottleClass}"></div>
            <div class="bottle-card-content">
                <h3>${bottle.title}</h3>
                <div class="bottle-info">
                    <span>${formattedDate}</span>
                    <span class="emotion-tag">${emotionLabel}</span>
                </div>
                ${timeInfo}
            </div>
            ${earlyOpenButton}
        `;
        
        // 添加卡片点击事件
        card.addEventListener('click', () => {
            this.viewBottleDetail(bottle.id);
        });
        
        // 添加提前打开按钮事件
        const earlyOpenListBtn = card.querySelector('.early-open-list-btn');
        if (earlyOpenListBtn) {
            earlyOpenListBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止事件冒泡
                this.confirmEarlyOpenFromList(bottle.id);
            });
        }
        
        container.appendChild(card);
    });
}
    
    // 获取空状态图标
    getEmptyStateIcon(containerId) {
        switch (containerId) {
            case 'sealed-bottles':
                return 'hourglass_empty';
            case 'openable-bottles':
                return 'lock_open';
            case 'resolved-bottles':
                return 'check_circle';
            default:
                return 'inbox';
        }
    }
    
    // 获取情绪标签文本
    getEmotionLabel(emotion) {
        const labels = {
            'anxious': '焦虑',
            'sad': '悲伤',
            'angry': '愤怒',
            'stressed': '压力',
            'confused': '困惑'
        };
        return labels[emotion] || '未知情绪';
    }
    
    // 查看瓶子详情
    viewBottleDetail(bottleId) {
        // 获取所有瓶子
        const bottles = JSON.parse(localStorage.getItem('worryBottles'));
        
        // 查找指定瓶子
        const bottle = bottles.find(b => b.id === bottleId);
        if (!bottle) return;
        
        // 保存当前瓶子
        this.currentBottle = bottle;
        
        // 更新详情页面
        this.updateBottleDetailView();
        
        // 导航到详情页
        this.navigateTo('bottle-detail-screen');
    }
    
    // 更新瓶子详情视图
    updateBottleDetailView() {
        const bottle = this.currentBottle;
        
        // 更新标题和元数据
        document.getElementById('detail-title').textContent = bottle.title;
        
        // 格式化日期
        const createdDate = new Date(bottle.createdAt);
        document.getElementById('detail-date').textContent = `${createdDate.getFullYear()}年${createdDate.getMonth() + 1}月${createdDate.getDate()}日`;
        
        // 设置情绪标签
        document.getElementById('detail-emotion').textContent = this.getEmotionLabel(bottle.emotion);
        
        // 设置瓶子图像
        document.getElementById('detail-bottle').className = `bottle-image ${bottle.bottleType}-bottle`;
        document.getElementById('openable-bottle').className = `bottle-image ${bottle.bottleType}-bottle glow`;
        
        // 更新内容
        document.getElementById('detail-content').textContent = bottle.content;
        
        // 隐藏所有状态区域
        document.querySelectorAll('.bottle-status').forEach(el => {
            el.classList.add('hidden');
        });
        
        // 根据状态显示对应区域
        if (bottle.status === 'sealed') {
            document.getElementById('sealed-status').classList.remove('hidden');
            
            // 计算剩余时间
            const now = new Date();
            const sealUntil = new Date(bottle.sealUntil);
            const daysLeft = Math.ceil((sealUntil - now) / (1000 * 60 * 60 * 24));
            document.getElementById('time-left').textContent = `还剩 ${daysLeft} 天`;
            
        } else if (bottle.status === 'openable') {
            document.getElementById('openable-status').classList.remove('hidden');
            
        } else if (bottle.status === 'resolved') {
            document.getElementById('resolved-status').classList.remove('hidden');
            
            // 显示最后一条感悟
            if (bottle.reflections && bottle.reflections.length > 0) {
                const lastReflection = bottle.reflections[bottle.reflections.length - 1];
                document.getElementById('saved-reflection').textContent = lastReflection;
            } else {
                document.getElementById('saved-reflection').textContent = '没有记录感悟';
            }
        }
    }
    
    // 打开瓶子
    openBottle() {
        if (!this.currentBottle || this.currentBottle.status !== 'openable') return;
        
        // 播放打开动画
        BottleAnimations.openBottleAnimation(this.currentBottle.bottleType)
            .then(() => {
                // 显示打开状态
                document.getElementById('openable-status').classList.add('hidden');
                document.getElementById('opened-status').classList.remove('hidden');
            });
    }
    
    // 处理烦恼已消除
    handleWorryGone() {
        // 显示反思录入界面
        document.getElementById('opened-status').classList.add('hidden');
        document.getElementById('reflection-status').classList.remove('hidden');
    }
    
    // 处理烦恼仍存在
    handleWorryRemains() {
        // 显示重新封存界面
        document.getElementById('opened-status').classList.add('hidden');
        document.getElementById('reseal-status').classList.remove('hidden');
        
        // 默认选择一周
        document.querySelectorAll('.reseal-time-selector .time-option').forEach(o => o.classList.remove('selected'));
        document.querySelector('.reseal-time-selector .time-option[data-days="7"]').classList.add('selected');
        this.resealDays = 7;
    }
    
    // 保存感悟
    saveReflection() {
        const reflectionText = document.getElementById('reflection-text').value.trim();
        
        if (!reflectionText) {
            alert('请输入你的感悟');
            return;
        }
        
        // 获取所有瓶子
        const bottles = JSON.parse(localStorage.getItem('worryBottles'));
        
        // 查找并更新当前瓶子
        const bottleIndex = bottles.findIndex(b => b.id === this.currentBottle.id);
        if (bottleIndex === -1) return;
        
        // 更新状态和感悟
        bottles[bottleIndex].status = 'resolved';
        if (!bottles[bottleIndex].reflections) {
            bottles[bottleIndex].reflections = [];
        }
        bottles[bottleIndex].reflections.push(reflectionText);
        
        // 保存回本地存储
        localStorage.setItem('worryBottles', JSON.stringify(bottles));
        
        // 更新当前瓶子
        this.currentBottle = bottles[bottleIndex];
        
        // 播放解决动画
        BottleAnimations.worryResolvedAnimation()
            .then(() => {
                // 更新视图
                this.navigateTo('bottle-list-screen');
                this.loadBottles();
            });
    }
    
    // 重新封存瓶子
    resealBottle() {
        // 获取所有瓶子
        const bottles = JSON.parse(localStorage.getItem('worryBottles'));
        
        // 查找并更新当前瓶子
        const bottleIndex = bottles.findIndex(b => b.id === this.currentBottle.id);
        if (bottleIndex === -1) return;
        
        // 更新状态和封存时间
        bottles[bottleIndex].status = 'sealed';
        bottles[bottleIndex].sealUntil = new Date(Date.now() + this.resealDays * 24 * 60 * 60 * 1000).toISOString();
        bottles[bottleIndex].resealCount += 1;
        
        // 保存回本地存储
        localStorage.setItem('worryBottles', JSON.stringify(bottles));
        
        // 更新当前瓶子
        this.currentBottle = bottles[bottleIndex];
        
        // 显示成功消息
        alert(`烦恼已重新封存，将在 ${this.resealDays} 天后可以再次打开`);
        
        // 更新视图
        this.navigateTo('bottle-list-screen');
        this.loadBottles();
    }
    // 确认提前打开
confirmEarlyOpen() {
    if (confirm('你确定要提前打开这个烦恼瓶子吗？')) {
        this.earlyOpenBottle();
    }
}

// 提前打开瓶子
earlyOpenBottle() {
    if (!this.currentBottle || this.currentBottle.status !== 'sealed') return;
    
    // 获取所有瓶子
    const bottles = JSON.parse(localStorage.getItem('worryBottles'));
    
    // 查找并更新当前瓶子
    const bottleIndex = bottles.findIndex(b => b.id === this.currentBottle.id);
    if (bottleIndex === -1) return;
    
    // 更新状态为可打开
    bottles[bottleIndex].status = 'openable';
    
    // 保存回本地存储
    localStorage.setItem('worryBottles', JSON.stringify(bottles));
    
    // 更新当前瓶子
    this.currentBottle = bottles[bottleIndex];
    
    // 显示提示信息
    alert('瓶子已可以打开');
    
    // 更新详情页面
    this.updateBottleDetailView();
}

// 从列表中提前打开确认
confirmEarlyOpenFromList(bottleId) {
    if (confirm('你确定要提前打开这个烦恼瓶子吗？')) {
        // 获取所有瓶子
        const bottles = JSON.parse(localStorage.getItem('worryBottles'));
        
        // 查找并更新指定瓶子
        const bottleIndex = bottles.findIndex(b => b.id === bottleId);
        if (bottleIndex === -1) return;
        
        // 更新状态为可打开
        bottles[bottleIndex].status = 'openable';
        
        // 保存回本地存储
        localStorage.setItem('worryBottles', JSON.stringify(bottles));
        
        // 显示提示信息
        alert('瓶子已可以打开');
        
        // 重新加载列表
        this.loadBottles();
    }
}
    
    // 页面导航
    navigateTo(screenId) {
        console.log(`导航至: ${screenId}`);
        
        // 隐藏当前屏幕
        document.getElementById(this.currentScreen).classList.remove('active');
        
        // 显示目标屏幕
        document.getElementById(screenId).classList.add('active');
        this.currentScreen = screenId;
    }
}

// 应用初始化
document.addEventListener('DOMContentLoaded', () => {
    window.worryBottleApp = new WorryBottleApp();
});
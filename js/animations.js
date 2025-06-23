// 动画效果类
class BottleAnimations {
    // 封存动画
    static async sealAnimation(bottleType, content) {
        // 创建动画容器
        const animContainer = document.createElement('div');
        animContainer.className = 'animation-container';
        
        // 瓶子图像
        const bottleElem = document.createElement('div');
        bottleElem.className = `bottle-image ${bottleType}-bottle animation-bottle`;
        
        // 烦恼内容元素
        const contentElem = document.createElement('div');
        contentElem.className = 'worry-content-animation';
        contentElem.textContent = content.substring(0, 20) + (content.length > 20 ? '...' : '');
        
        // 烦恼封入效果容器
        const sealEffectElem = document.createElement('div');
        sealEffectElem.className = 'seal-effect';
        
        // 添加到容器
        animContainer.appendChild(contentElem);
        animContainer.appendChild(bottleElem);
        animContainer.appendChild(sealEffectElem);
        
        // 添加到页面
        document.body.appendChild(animContainer);
        
        // 播放动画
        return new Promise(resolve => {
            // 添加动画类
            setTimeout(() => {
                animContainer.classList.add('show');
                contentElem.classList.add('move-to-bottle');
            }, 100);
            
            // 内容进入瓶子
            setTimeout(() => {
                contentElem.classList.add('inside-bottle');
                sealEffectElem.classList.add('seal');
            }, 1500);
            
            // 瓶子下沉
            setTimeout(() => {
                bottleElem.classList.add('sink');
                
                // 动画结束后清理
                setTimeout(() => {
                    animContainer.classList.add('fade-out');
                    
                    setTimeout(() => {
                        document.body.removeChild(animContainer);
                        resolve();
                    }, 1000);
                }, 1500);
            }, 2500);
        });
    }
    
    // 打开瓶子动画
    static async openBottleAnimation(bottleType) {
        // 创建动画容器
        const animContainer = document.createElement('div');
        animContainer.className = 'animation-container opening';
        
        // 瓶子图像
        const bottleElem = document.createElement('div');
        bottleElem.className = `bottle-image ${bottleType}-bottle animation-bottle`;
        
        // 添加到容器
        animContainer.appendChild(bottleElem);
        
        // 添加到页面
        document.body.appendChild(animContainer);
        
        // 播放动画
        return new Promise(resolve => {
            // 添加动画类
            setTimeout(() => {
                animContainer.classList.add('show');
                bottleElem.classList.add('rise');
            }, 100);
            
            // 打开瓶子
            setTimeout(() => {
                bottleElem.classList.add('open');
                
                // 动画结束后清理
                setTimeout(() => {
                    animContainer.classList.add('fade-out');
                    
                    setTimeout(() => {
                        document.body.removeChild(animContainer);
                        resolve();
                    }, 1000);
                }, 1500);
            }, 1500);
        });
    }
    
    // 烦恼解决动画
    static async worryResolvedAnimation() {
        // 创建动画容器
        const animContainer = document.createElement('div');
        animContainer.className = 'animation-container resolved';
        
        // 烟花效果
        for (let i = 0; i < 15; i++) {
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.left = `${Math.random() * 80 + 10}%`;
            firework.style.top = `${Math.random() * 80 + 10}%`;
            firework.style.animationDelay = `${Math.random() * 0.5}s`;
            
            // 随机颜色
            const colors = ['#5f84a2', '#5ca270', '#a27c5c', '#a25c7c', '#7c5ca2'];
            firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            animContainer.appendChild(firework);
        }
        
        // 成功消息
        const messageElem = document.createElement('div');
        messageElem.className = 'resolve-message';
        messageElem.textContent = '恭喜你战胜了这个烦恼！';
        animContainer.appendChild(messageElem);
        
        // 添加到页面
        document.body.appendChild(animContainer);
        
        // 播放动画
        return new Promise(resolve => {
            // 添加动画类
            setTimeout(() => {
                animContainer.classList.add('show');
            }, 100);
            
            // 动画结束后清理
            setTimeout(() => {
                animContainer.classList.add('fade-out');
                
                setTimeout(() => {
                    document.body.removeChild(animContainer);
                    resolve();
                }, 1000);
            }, 4000);
        });
    }
}
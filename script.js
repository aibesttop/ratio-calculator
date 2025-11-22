// DTI计算器主要逻辑

function calculateDTI() {
    // 获取收入
    const monthlyIncome = parseFloat(document.getElementById('monthly-income').value) || 0;

    // 获取所有债务
    const mortgage = parseFloat(document.getElementById('mortgage').value) || 0;
    const carLoan = parseFloat(document.getElementById('car-loan').value) || 0;
    const creditCard = parseFloat(document.getElementById('credit-card').value) || 0;
    const studentLoan = parseFloat(document.getElementById('student-loan').value) || 0;
    const otherDebt = parseFloat(document.getElementById('other-debt').value) || 0;

    // 验证输入
    if (monthlyIncome <= 0) {
        alert('请输入有效的月度收入！');
        return;
    }

    // 计算总债务
    const totalDebt = mortgage + carLoan + creditCard + studentLoan + otherDebt;

    // 计算DTI
    const dtiRatio = (totalDebt / monthlyIncome) * 100;

    // 显示结果
    displayResults(monthlyIncome, totalDebt, dtiRatio);

    // 滚动到结果区域
    setTimeout(() => {
        document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

function displayResults(income, debt, dti) {
    // 显示结果区域
    document.getElementById('results').style.display = 'block';
    document.getElementById('reset-btn').style.display = 'block';

    // 格式化数字
    const formatCurrency = (num) => {
        return '¥' + num.toLocaleString('zh-CN', { maximumFractionDigits: 0 });
    };

    // 显示基本数据
    document.getElementById('dti-value').textContent = dti.toFixed(1) + '%';
    document.getElementById('total-income').textContent = formatCurrency(income);
    document.getElementById('total-debt').textContent = formatCurrency(debt);

    // 获取评级
    const rating = getRating(dti);

    // 显示评级
    const ratingCard = document.getElementById('rating-card');
    ratingCard.className = 'rating-card ' + rating.class;
    document.getElementById('rating-title').textContent = rating.title;
    document.getElementById('rating-description').textContent = rating.description;

    // 显示建议
    displayAdvice(dti, income, debt, rating);
}

function getRating(dti) {
    if (dti < 28) {
        return {
            class: 'excellent',
            title: '🌟 优秀',
            description: '您的财务状况非常健康！贷款机构会非常欢迎您的申请，您在贷款审批中具有明显优势。'
        };
    } else if (dti < 36) {
        return {
            class: 'good',
            title: '👍 良好',
            description: '您的财务状况良好，符合大多数贷款机构的要求。您应该能够顺利获得贷款审批。'
        };
    } else if (dti < 43) {
        return {
            class: 'fair',
            title: '⚠️ 一般',
            description: '您的债务负担较重，虽然仍有可能获得贷款，但可能需要满足额外条件或支付更高利率。'
        };
    } else {
        return {
            class: 'poor',
            title: '❌ 需改善',
            description: '您的债务负担过重，获得贷款审批会比较困难。建议优先降低债务或增加收入。'
        };
    }
}

function displayAdvice(dti, income, debt, rating) {
    const adviceList = document.getElementById('advice-list');
    adviceList.innerHTML = '';

    const advice = [];

    if (dti >= 43) {
        advice.push('建议尽快降低债务，优先偿还高利率债务（如信用卡）');
        advice.push('考虑增加收入来源，如兼职、副业或投资收益');
        advice.push('暂缓大额消费和新增贷款申请');
        advice.push('咨询专业财务顾问，制定债务管理计划');
    } else if (dti >= 36) {
        advice.push('尝试降低月度债务支出，提前还款可以改善DTI');
        advice.push('避免新增债务，暂缓大额消费计划');
        advice.push('如计划申请贷款，可能需要准备更高的首付比例');
    } else if (dti >= 28) {
        advice.push('保持当前的财务状况，继续按时还款');
        advice.push('如有余力，可以考虑提前还款降低DTI');
        advice.push('建立应急储蓄金，建议为3-6个月的支出');
    } else {
        advice.push('保持优秀的财务习惯！');
        advice.push('可以考虑增加投资，实现财富增值');
        advice.push('继续维持低债务比率，这是您的竞争优势');
        advice.push('您有较强的贷款议价能力，可以争取更优惠的利率');
    }

    // 添加通用建议
    const frontEndDTI = calculateFrontEndDTI();
    if (frontEndDTI !== null && frontEndDTI > 28) {
        advice.push(`您的住房支出占收入的 ${frontEndDTI.toFixed(1)}%，建议控制在28%以内`);
    }

    // 渲染建议列表
    advice.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        adviceList.appendChild(li);
    });
}

function calculateFrontEndDTI() {
    const monthlyIncome = parseFloat(document.getElementById('monthly-income').value) || 0;
    const mortgage = parseFloat(document.getElementById('mortgage').value) || 0;

    if (monthlyIncome > 0 && mortgage > 0) {
        return (mortgage / monthlyIncome) * 100;
    }
    return null;
}

function resetCalculator() {
    // 清空所有输入
    document.getElementById('monthly-income').value = '';
    document.getElementById('mortgage').value = '';
    document.getElementById('car-loan').value = '';
    document.getElementById('credit-card').value = '';
    document.getElementById('student-loan').value = '';
    document.getElementById('other-debt').value = '';

    // 隐藏结果
    document.getElementById('results').style.display = 'none';
    document.getElementById('reset-btn').style.display = 'none';

    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 添加键盘事件监听
document.addEventListener('DOMContentLoaded', function() {
    // 为所有输入框添加回车键计算功能
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                calculateDTI();
            }
        });

        // 添加输入验证：不允许负数
        input.addEventListener('input', function() {
            if (this.value < 0) {
                this.value = 0;
            }
        });
    });

    // 添加实时计算提示（可选）
    inputs.forEach(input => {
        input.addEventListener('blur', updateQuickPreview);
    });
});

function updateQuickPreview() {
    const monthlyIncome = parseFloat(document.getElementById('monthly-income').value) || 0;
    const mortgage = parseFloat(document.getElementById('mortgage').value) || 0;
    const carLoan = parseFloat(document.getElementById('car-loan').value) || 0;
    const creditCard = parseFloat(document.getElementById('credit-card').value) || 0;
    const studentLoan = parseFloat(document.getElementById('student-loan').value) || 0;
    const otherDebt = parseFloat(document.getElementById('other-debt').value) || 0;

    if (monthlyIncome > 0) {
        const totalDebt = mortgage + carLoan + creditCard + studentLoan + otherDebt;
        const dti = (totalDebt / monthlyIncome) * 100;

        // 可以在这里添加实时预览功能
        // 例如在标题或按钮上显示预估DTI
    }
}

// 添加动画效果
function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = current.toFixed(1) + '%';
    }, 16);
}

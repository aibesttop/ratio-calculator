// DTI Calculator Main Logic

function calculateDTI() {
    // Get income
    const monthlyIncome = parseFloat(document.getElementById('monthly-income').value) || 0;

    // Get all debts
    const mortgage = parseFloat(document.getElementById('mortgage').value) || 0;
    const carLoan = parseFloat(document.getElementById('car-loan').value) || 0;
    const creditCard = parseFloat(document.getElementById('credit-card').value) || 0;
    const studentLoan = parseFloat(document.getElementById('student-loan').value) || 0;
    const otherDebt = parseFloat(document.getElementById('other-debt').value) || 0;

    // Validate input
    if (monthlyIncome <= 0) {
        alert('Please enter a valid monthly income!');
        return;
    }

    // Calculate total debt
    const totalDebt = mortgage + carLoan + creditCard + studentLoan + otherDebt;

    // Calculate DTI
    const dtiRatio = (totalDebt / monthlyIncome) * 100;

    // Display results
    displayResults(monthlyIncome, totalDebt, dtiRatio);

    // Scroll to results
    setTimeout(() => {
        document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

function displayResults(income, debt, dti) {
    // Show results section
    document.getElementById('results').style.display = 'block';
    document.getElementById('reset-btn').style.display = 'block';

    // Format numbers
    const formatCurrency = (num) => {
        return '$' + num.toLocaleString('en-US', { maximumFractionDigits: 0 });
    };

    // Display basic data
    document.getElementById('dti-value').textContent = dti.toFixed(1) + '%';
    document.getElementById('total-income').textContent = formatCurrency(income);
    document.getElementById('total-debt').textContent = formatCurrency(debt);

    // Get rating
    const rating = getRating(dti);

    // Display rating
    const ratingCard = document.getElementById('rating-card');
    ratingCard.className = 'rating-card ' + rating.class;
    document.getElementById('rating-title').textContent = rating.title;
    document.getElementById('rating-description').textContent = rating.description;

    // Display recommendations
    displayAdvice(dti, income, debt, rating);
}

function getRating(dti) {
    if (dti < 28) {
        return {
            class: 'excellent',
            title: '🌟 Excellent',
            description: 'Your financial situation is very healthy! Lenders will welcome your application, and you have a significant advantage in loan approval.'
        };
    } else if (dti < 36) {
        return {
            class: 'good',
            title: '👍 Good',
            description: 'Your financial situation is good and meets most lenders\' requirements. You should be able to obtain loan approval smoothly.'
        };
    } else if (dti < 43) {
        return {
            class: 'fair',
            title: '⚠️ Fair',
            description: 'Your debt burden is relatively high. While you may still qualify for a loan, you might need to meet additional conditions or pay higher interest rates.'
        };
    } else {
        return {
            class: 'poor',
            title: '❌ Needs Improvement',
            description: 'Your debt burden is too heavy, and obtaining loan approval will be quite difficult. It\'s recommended to prioritize reducing debt or increasing income.'
        };
    }
}

function displayAdvice(dti, income, debt, rating) {
    const adviceList = document.getElementById('advice-list');
    adviceList.innerHTML = '';

    const advice = [];

    if (dti >= 43) {
        advice.push('Reduce debt as soon as possible, prioritizing high-interest debts (like credit cards)');
        advice.push('Consider increasing income sources, such as side jobs, freelancing, or investment income');
        advice.push('Postpone large purchases and new loan applications');
        advice.push('Consult a professional financial advisor to develop a debt management plan');
    } else if (dti >= 36) {
        advice.push('Try to reduce monthly debt payments; early repayment can improve DTI');
        advice.push('Avoid new debt and postpone major spending plans');
        advice.push('If planning to apply for a loan, you may need to prepare a higher down payment');
    } else if (dti >= 28) {
        advice.push('Maintain your current financial situation and continue making timely payments');
        advice.push('If you have extra funds, consider early repayment to lower DTI');
        advice.push('Build an emergency fund, recommended to cover 3-6 months of expenses');
    } else {
        advice.push('Keep up your excellent financial habits!');
        advice.push('Consider increasing investments for wealth growth');
        advice.push('Continue maintaining a low debt ratio; this is your competitive advantage');
        advice.push('You have strong loan negotiation power and can seek more favorable interest rates');
    }

    // Add general advice
    const frontEndDTI = calculateFrontEndDTI();
    if (frontEndDTI !== null && frontEndDTI > 28) {
        advice.push(`Your housing expenses are ${frontEndDTI.toFixed(1)}% of income; recommended to keep below 28%`);
    }

    // Render advice list
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
    // Clear all inputs
    document.getElementById('monthly-income').value = '';
    document.getElementById('mortgage').value = '';
    document.getElementById('car-loan').value = '';
    document.getElementById('credit-card').value = '';
    document.getElementById('student-loan').value = '';
    document.getElementById('other-debt').value = '';

    // Hide results
    document.getElementById('results').style.display = 'none';
    document.getElementById('reset-btn').style.display = 'none';

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Add keyboard event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add Enter key calculation for all inputs
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                calculateDTI();
            }
        });

        // Add input validation: no negative numbers
        input.addEventListener('input', function() {
            if (this.value < 0) {
                this.value = 0;
            }
        });
    });

    // Add real-time calculation hint (optional)
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

        // Can add real-time preview here
        // e.g., display estimated DTI in title or button
    }
}

// Add animation effects
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

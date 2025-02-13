const getCompatibility = (name1, name2) => {
    const getNameValue = name => name.toLowerCase()
        .replace(/[^a-zа-я]/g, '')
        .split('')
        .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    
    const getNumerologyValue = name => {
        const numerologyMap = {
            'а': 1, 'б': 2, 'в': 3, 'г': 4, 'д': 5, 'е': 6, 'ё': 7, 'ж': 8, 'з': 9,
            'и': 1, 'й': 2, 'к': 3, 'л': 4, 'м': 5, 'н': 6, 'о': 7, 'п': 8, 'р': 9,
            'с': 1, 'т': 2, 'у': 3, 'ф': 4, 'х': 5, 'ц': 6, 'ч': 7, 'ш': 8, 'щ': 9,
            'ъ': 1, 'ы': 2, 'ь': 3, 'э': 4, 'ю': 5, 'я': 6
        };
        return name.toLowerCase()
            .replace(/[^а-я]/g, '')
            .split('')
            .reduce((sum, char) => sum + (numerologyMap[char] || 0), 0);
    };
    
    const getCommonLettersBonus = (name1, name2) => {
        const set1 = new Set(name1.toLowerCase());
        const set2 = new Set(name2.toLowerCase());
        const commonLetters = [...set1].filter(char => set2.has(char)).length;
        return (commonLetters / Math.max(set1.size, set2.size)) * 20;
    };
    
    const value1 = getNameValue(name1) + getNumerologyValue(name1);
    const value2 = getNameValue(name2) + getNumerologyValue(name2);
    const baseCompatibility = (Math.min(value1, value2) / Math.max(value1, value2)) * 80;
    const commonBonus = getCommonLettersBonus(name1, name2);
    const randomFactor = (Math.random() * 10 - 5);
    
    return Math.max(0, Math.min(100, baseCompatibility + commonBonus + randomFactor)).toFixed(2);
};

const animatePercentage = finalValue => {
    let start = 0;
    const percentageElement = document.getElementById('percentage');
    percentageElement.textContent = '0%';
    percentageElement.style.opacity = '1';
    percentageElement.style.transform = 'scale(1)';
    
    const interval = setInterval(() => {
        if (start >= finalValue) {
            percentageElement.textContent = `${finalValue}%`;
            clearInterval(interval);
        } else {
            start++;
            percentageElement.textContent = `${start}%`;
        }
    }, 15);
};

const sendDataToAPI = async (firstName, secondName, percent) => {
    try {
        const response = await fetch('https://6792545acf994cc68049a4b2.mockapi.io/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ first_name: firstName, second_name: secondName, percent })
        });
        const data = await response.json();
        console.log('Success:', data);
    } catch (error) {
        console.error('Error:', error);
    }
};

const calculateCompatibility = () => {
    const name1 = document.getElementById('name1').value.trim();
    const name2 = document.getElementById('name2').value.trim();
    
    if (!name1 || !name2) {
        alert('Введите оба имени!');
        return;
    }
    
    const result = getCompatibility(name1, name2);
    document.getElementById('form-container').style.display = 'none';
    document.getElementById('result-container').style.display = 'block';
    document.getElementById('result-container').style.opacity = '1';
    document.getElementById('result-container').style.transform = 'scale(1)';
    animatePercentage(result);
    
    sendDataToAPI(name1, name2, result);
};

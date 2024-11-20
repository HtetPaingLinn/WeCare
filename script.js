const calendarDays = document.getElementById('calendarDays');
const calendarHeader = document.getElementById('calendarHeader');
const cycleLengthSelect = document.getElementById('cycleLength');
const tooltip = document.getElementById('tooltip');
const selectedDateText = document.getElementById('selectedDateText');
const dateDetails = document.getElementById('dateDetails');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendMessage = document.getElementById('sendMessage');
let currentMonth = new Date();
let cycleLength = 28;
let lastPeriod = null;

function generateCalendar() {
  calendarDays.innerHTML = '';
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

  calendarHeader.textContent = firstDay.toLocaleString('default', { month: 'long', year: 'numeric' });

  for (let i = 0; i < firstDay.getDay(); i++) {
    calendarDays.innerHTML += '<div></div>';
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dayElement = document.createElement('div');
    dayElement.classList.add('p-2', 'text-center', 'rounded-lg', 'cursor-pointer', 'hover:bg-blue-100', 'transition');
    dayElement.dataset.date = date.toISOString().split('T')[0];
    dayElement.textContent = day;

    if (lastPeriod) {
      const diffDays = Math.floor((date - lastPeriod) / (1000 * 60 * 60 * 24));
      const ovulationDay = cycleLength - 14; // Approximation
      const pregnancyTestDay = ovulationDay + 10;

      if (diffDays % cycleLength === 0) {
        dayElement.classList.add('next-period');
        dayElement.dataset.tooltip = 'Next Period';
      } else if (diffDays % cycleLength === ovulationDay) {
        dayElement.classList.add('ovulation-day');
        dayElement.dataset.tooltip = 'Ovulation Day';
      } else if (diffDays % cycleLength >= ovulationDay - 5 && diffDays % cycleLength <= ovulationDay) {
        dayElement.classList.add('fertile-window');
        dayElement.dataset.tooltip = 'Fertile Window';
      } else if (diffDays % cycleLength === pregnancyTestDay) {
        dayElement.classList.add('pregnancy-test-day');
        dayElement.dataset.tooltip = 'Pregnancy Test Day';
      }
    }

    dayElement.addEventListener('click', () => {
      lastPeriod = new Date(dayElement.dataset.date);
      selectedDateText.textContent = dayElement.dataset.date;
      Array.from(calendarDays.children).forEach(child => child.classList.remove('selected-date'));
      dayElement.classList.add('selected-date');
      generateCalendar();
    });

    dayElement.addEventListener('mouseover', e => {
      if (dayElement.dataset.tooltip) {
        tooltip.textContent = dayElement.dataset.tooltip;
        tooltip.style.display = 'block';
        tooltip.style.top = e.pageY + 10 + 'px';
        tooltip.style.left = e.pageX + 10 + 'px';
      }
    });

    dayElement.addEventListener('mouseout', () => {
      tooltip.style.display = 'none';
    });

    calendarDays.appendChild(dayElement);
  }
}

document.getElementById('prevMonth').addEventListener('click', () => {
  currentMonth.setMonth(currentMonth.getMonth() - 1);
  generateCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
  currentMonth.setMonth(currentMonth.getMonth() + 1);
  generateCalendar();
});

document.getElementById('setCycle').addEventListener('click', () => {
  cycleLength = parseInt(cycleLengthSelect.value, 10);
  generateCalendar();
});

// Chatbot logic...
sendMessage.addEventListener('click', () => {
  const userMessage = chatInput.value.trim();
  if (userMessage) {
    addMessageToChat('user', userMessage);
    chatInput.value = '';
    setTimeout(() => addMessageToChat('bot', 'This is a simulated response. Your AI chatbot logic goes here!'), 1000);
  }
});

function addMessageToChat(sender, message) {
  const messageDiv = document.createElement('div');
  messageDiv.className = sender === 'user' ? 'text-right' : 'text-left';
  messageDiv.innerHTML = `<span class="px-4 py-2 rounded-lg inline-block ${sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black'}">${message}</span>`;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

generateCalendar();

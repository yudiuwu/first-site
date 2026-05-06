/**
 * Cofre Secreto — script.js
 * Altere SECRET_CODE para definir o código correto.
 */

const SECRET_CODE = '7391';

// ── Estado ──────────────────────────────────────────────
let currentInput = '';

// ── Referências DOM ─────────────────────────────────────
const slots      = Array.from({ length: 4 }, (_, i) => document.getElementById(`slot-${i}`));
const slotsWrap  = document.querySelector('.display__slots');
const keys       = document.querySelectorAll('.key');
const openBtn    = document.getElementById('open-btn');
const messageEl  = document.getElementById('message');

// ── Funções de display ───────────────────────────────────

function updateSlots() {
  slots.forEach((slot, i) => {
    slot.classList.remove('slot--active', 'slot--filled', 'digit-enter');
    const digit = currentInput[i];

    if (digit !== undefined) {
      slot.textContent = digit;
      slot.classList.add('slot--filled');
    } else {
      slot.textContent = '';
    }

    if (i === currentInput.length) {
      slot.classList.add('slot--active');
    }
  });
}

function flashLastSlot() {
  const idx = currentInput.length - 1;
  if (idx < 0) return;
  slots[idx].classList.add('digit-enter');
  slots[idx].addEventListener('animationend', () => {
    slots[idx].classList.remove('digit-enter');
  }, { once: true });
}

// ── Mensagens ────────────────────────────────────────────

function showMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className = `safe__message msg--visible msg--${type}`;
}

function clearMessage() {
  messageEl.className = 'safe__message';
  messageEl.textContent = '';
}

// ── Reset visual ─────────────────────────────────────────

function resetDisplay() {
  slots.forEach(s => {
    s.classList.remove('slot--success', 'slot--error');
  });
  clearMessage();
}

// ── Adicionar dígito ─────────────────────────────────────

function addDigit(digit) {
  if (currentInput.length >= 4) return;

  resetDisplay();
  currentInput += digit;
  updateSlots();
  flashLastSlot();
}

// ── Verificar código ─────────────────────────────────────

function openSafe() {
  if (currentInput.length < 4) {
    showMessage('⚠ Digite os 4 dígitos primeiro.', 'warn');
    slotsWrap.classList.add('shake');
    slotsWrap.addEventListener('animationend', () => {
      slotsWrap.classList.remove('shake');
    }, { once: true });
    return;
  }

  if (currentInput === SECRET_CODE) {
    // Sucesso
    slots.forEach(s => {
      s.classList.remove('slot--error');
      s.classList.add('slot--success');
    });
    showMessage('✔ Cofre aberto com sucesso!', 'success');
    openBtn.querySelector('.open-btn__icon').textContent = '🔓';

    // Reseta após 3s para nova tentativa
    setTimeout(() => {
      currentInput = '';
      slots.forEach(s => s.classList.remove('slot--success'));
      openBtn.querySelector('.open-btn__icon').textContent = '🔓';
      updateSlots();
      clearMessage();
    }, 3000);

  } else {
    // Erro
    slots.forEach(s => {
      s.classList.remove('slot--success');
      s.classList.add('slot--error');
    });
    showMessage('✖ Código incorreto. Tente novamente.', 'error');

    slotsWrap.classList.add('shake');
    slotsWrap.addEventListener('animationend', () => {
      slotsWrap.classList.remove('shake');
    }, { once: true });

    // Limpa após 1.2s
    setTimeout(() => {
      currentInput = '';
      slots.forEach(s => s.classList.remove('slot--error'));
      updateSlots();
      clearMessage();
    }, 1200);
  }
}

// ── Ripple nos botões ─────────────────────────────────────

function createRipple(button, event) {
  const rect   = button.getBoundingClientRect();
  const size   = Math.max(rect.width, rect.height);
  const x      = (event.clientX ?? rect.left + rect.width / 2) - rect.left - size / 2;
  const y      = (event.clientY ?? rect.top + rect.height / 2) - rect.top - size / 2;

  const ripple = document.createElement('span');
  ripple.classList.add('ripple');
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
  button.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}

// ── Event Listeners ──────────────────────────────────────

keys.forEach(key => {
  key.addEventListener('click', (e) => {
    createRipple(key, e);
    key.classList.add('key--pressed');
    setTimeout(() => key.classList.remove('key--pressed'), 150);
    addDigit(key.dataset.digit);
  });
});

openBtn.addEventListener('click', (e) => {
  createRipple(openBtn, e);
  openSafe();
});

// Suporte a teclado físico
document.addEventListener('keydown', (e) => {
  const digit = e.key;
  if (/^[0-9]$/.test(digit)) {
    const matchingKey = document.querySelector(`.key[data-digit="${digit}"]`);
    if (matchingKey) {
      matchingKey.classList.add('key--pressed');
      setTimeout(() => matchingKey.classList.remove('key--pressed'), 150);
    }
    addDigit(digit);
  }
  if (e.key === 'Enter') openSafe();
});

// ── Init ─────────────────────────────────────────────────
updateSlots();

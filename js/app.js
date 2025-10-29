document.addEventListener('DOMContentLoaded', function () {

  const navToggle = document.querySelector('.nav-toggle');
  const navUl = document.querySelector('nav ul');
  if (navToggle && navUl) {
    navToggle.addEventListener('click', () => {
      navUl.style.display = navUl.style.display === 'flex' ? 'none' : 'flex';
      navUl.style.flexDirection = 'column';
    });
  }

  function setInputFilter(el, filter) {
    el.addEventListener('input', () => {
      const old = el.value;
      const filtered = filter(old);
      if (old !== filtered) el.value = filtered;
    });
  }

  const cpfInput = document.querySelector('#cpf');
  const telInput = document.querySelector('#telefone');
  const cepInput = document.querySelector('#cep');

  if (cpfInput) {
    setInputFilter(cpfInput, v => {
      const d = v.replace(/\D/g, '').slice(0, 11);
      return d.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (_, a, b, c, d2) =>
        a + (b ? '.' + b : '') + (c ? '.' + c : '') + (d2 ? '-' + d2 : '')
      );
    });
  }

  if (telInput) {
    setInputFilter(telInput, v => {
      const d = v.replace(/\D/g, '').slice(0, 11);
      return d.length <= 10
        ? d.replace(/(\d{2})(\d{0,4})(\d{0,4})/, (_, a, b, c) =>
            (a ? '(' + a + ') ' : '') + (b || '') + (c ? '-' + c : '')
          )
        : d.replace(/(\d{2})(\d{5})(\d{0,4})/, (_, a, b, c) =>
            '(' + a + ') ' + b + (c ? '-' + c : '')
          );
    });
  }

  if (cepInput) {
    setInputFilter(cepInput, v => {
      const d = v.replace(/\D/g, '').slice(0, 8);
      return d.replace(/(\d{5})(\d{0,3})/, (_, a, b) => a + (b ? '-' + b : ''));
    });
  }

  // Validação de formulário
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const nome = form.querySelector('#nome');
      const email = form.querySelector('#email');
      const cpf = form.querySelector('#cpf');
      const telefone = form.querySelector('#telefone');
      const statusEl = form.querySelector('.form-status');

      const errors = [];
      if (!nome.value.trim()) errors.push('Nome é obrigatório.');
      if (!email.value.trim() || !/^\S+@\S+\.\S+$/.test(email.value)) errors.push('Email inválido.');
      if (!cpf.value.trim() || !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf.value)) errors.push('CPF inválido.');
      if (!telefone.value.trim() || telefone.value.replace(/\D/g, '').length < 10) errors.push('Telefone inválido.');

      if (errors.length) {
        statusEl.textContent = errors.join(' ');
        statusEl.className = 'form-status error';
        statusEl.style.display = 'block';
        return;
      }

      const cadastro = {
        nome: nome.value.trim(),
        email: email.value.trim(),
        cpf: cpf.value.trim(),
        telefone: telefone.value.trim(),
        criadoEm: new Date().toISOString()
      };
      const stored = JSON.parse(localStorage.getItem('cadastros') || '[]');
      stored.push(cadastro);
      localStorage.setItem('cadastros', JSON.stringify(stored));

      statusEl.textContent = 'Cadastro enviado com sucesso!';
      statusEl.className = 'form-status success';
      statusEl.style.display = 'block';
      setTimeout(() => form.reset(), 1000);
    });
  }
});
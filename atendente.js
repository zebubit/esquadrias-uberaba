/* Ali · assistente virtual da Esquadrias Uberaba
   Uso:
     <script src="https://biovenda.app.br/atendente/esquadrias.js" data-origem="bio" data-logo="/modelos/esquadriasuberaba/img/logo-mark.png" defer></script>
   data-origem: "bio" | "site" (muda so a mensagem do atalho de WhatsApp)
   data-logo: caminho da marca usada no botao
   data-bottom: distancia do botao ate a base da tela, em px (padrao 18)
*/
(function () {
  'use strict';

  var script  = document.currentScript || (function () {
    var s = document.getElementsByTagName('script');
    return s[s.length - 1];
  })();

  var API     = 'https://n8n.dionefolador.com/webhook/esquadrias-bio';
  var WHATS   = script.getAttribute('data-whats') || '5534988270211';
  var ORIGEM  = (script.getAttribute('data-origem') || 'bio').toLowerCase();
  var LOGO    = script.getAttribute('data-logo') || 'https://biovenda.app.br/modelos/esquadriasuberaba/img/logo-mark.png';
  var BASE    = parseInt(script.getAttribute('data-bottom') || '18', 10) || 18;
  var DE      = ORIGEM === 'site' ? 'pelo site' : 'pelo link da bio';
  var SESSAO  = 'ali-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);

  var CONVITES = ['Quer um orçamento?', 'Posso te ajudar?', 'Fale comigo'];
  var ABERTURA = 'Oi! Sou a Ali, assistente da Esquadrias Uberaba. Posso te ajudar com portas, janelas, vidros e orçamento. O que você está procurando?';

  /* ---------------- estilo ---------------- */
  var css = ''
  + '.ali-b,.ali-p,.ali-c{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;box-sizing:border-box}'
  + '.ali-b *,.ali-p *{box-sizing:border-box}'
  + '.ali-b{position:relative;width:78px;height:78px;flex:none;border:0;padding:0;'
  +   'cursor:pointer;background:transparent;display:grid;place-items:center;'
  +   'animation:ali-flutua 4.2s ease-in-out infinite;transition:transform .22s ease;'
  +   'filter:drop-shadow(0 10px 16px rgba(0,0,0,.45)) drop-shadow(0 0 14px rgba(255,138,31,.22))}'
  + '.ali-b:hover{transform:scale(1.06)}'
  + '.ali-b:active{transform:scale(.95)}'
  + '.ali-logo{display:grid;place-items:center;width:100%;height:100%;border-radius:50%;background:#0e0e0f;border:3px solid #ff8a1f;box-shadow:0 0 0 3px rgba(255,138,31,.25)}.ali-logo img{width:56%;height:auto;object-fit:contain}'
  + '.ali-av .ali-logo{border-width:2px;box-shadow:none}'
  + '.ali-av{background:transparent!important}'
  + '.ali-olho{transform-origin:center;animation:ali-pisca-olho 5.6s infinite}'
  + '.ali-farol{animation:ali-farol 2.8s ease-in-out infinite}'
  + '.ali-sombra{animation:ali-sombra 4.2s ease-in-out infinite}'
  + '@keyframes ali-farol{0%,100%{opacity:.45}50%{opacity:1}}'
  + '@keyframes ali-sombra{0%,100%{transform:scaleX(1);opacity:.3}50%{transform:scaleX(.86);opacity:.2}}'
  + '.ali-antena{transform-origin:22px 9px;animation:ali-antena 3.4s ease-in-out infinite}'
  + '@keyframes ali-pisca-olho{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.12)}}'
  + '@keyframes ali-antena{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(7deg)}}'
  + '.ali-orb{position:fixed;right:18px;bottom:18px;z-index:2147483000;display:flex;align-items:center;gap:10px;'
  +   'flex-direction:row-reverse;animation:ali-ronda 26s ease-in-out infinite;will-change:transform}'
  + '.ali-orb.ali-parado{animation:none;transform:none}'
  + '@keyframes ali-ronda{'
  +   '0%,8%{transform:translateX(0)}'
  +   '38%,54%{transform:translateX(calc(-1 * min(46vw, 380px)))}'
  +   '84%,100%{transform:translateX(0)}}'
    + '@keyframes ali-flutua{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}'
  + '.ali-orb.ali-off{display:none}'
  + '.ali-cv{max-width:200px;flex:none;'
  +   'background:#fff;color:#111113;padding:11px 15px;border-radius:16px 16px 3px 16px;'
  +   'font-size:14px;line-height:1.45;font-weight:500;box-shadow:0 8px 26px rgba(0,0,0,.24);'
  +   'opacity:0;transform:translateY(6px) scale(.94);transition:opacity .3s ease,transform .3s ease;'
  +   'cursor:pointer;pointer-events:none}'
  + '.ali-cv.ali-ver{opacity:1;transform:none;pointer-events:auto}'
  + '.ali-p{position:fixed;right:18px;bottom:18px;z-index:2147483001;width:min(370px,calc(100vw - 24px));'
  +   'height:min(560px,calc(100dvh - 36px));background:#111113;border:1px solid rgba(255,138,31,.26);'
  +   'border-radius:20px;box-shadow:0 22px 60px rgba(0,0,0,.5);display:none;flex-direction:column;overflow:hidden}'
  + '.ali-p.ali-ver{display:flex;animation:ali-abre .26s ease both}'
  + '@keyframes ali-abre{from{opacity:0;transform:translateY(14px) scale(.97)}to{opacity:1;transform:none}}'
  + '.ali-h{flex:none;padding:14px 15px;background:linear-gradient(140deg,#1a1a1d,#111113);'
  +   'border-bottom:1px solid rgba(255,138,31,.2);display:flex;align-items:center;gap:11px}'
  + '.ali-av{width:38px;height:38px;border-radius:50%;flex:none;display:grid;place-items:center;'
  +   'background:linear-gradient(140deg,#ffb454,#ff7a00);color:#150a00}'
  + '.ali-av svg{width:20px;height:20px}'
  + '.ali-hn{flex:1;min-width:0}'
  + '.ali-hn b{display:block;font-size:14.5px;color:#f4efe8;font-weight:600;line-height:1.2}'
  + '.ali-hn i{display:block;font-style:normal;font-size:11.5px;color:#a8a39a;margin-top:2px}'
  + '.ali-hn i::before{content:"";display:inline-block;width:6px;height:6px;border-radius:50%;'
  +   'background:#4ec77d;margin-right:5px;vertical-align:middle}'
  + '.ali-x{flex:none;width:34px;height:34px;border:0;background:transparent;color:#a8a39a;'
  +   'cursor:pointer;border-radius:9px;font-size:21px;line-height:1}'
  + '.ali-x:hover{background:rgba(255,255,255,.07);color:#f4efe8}'
  + '.ali-atalho{flex:none;padding:9px 15px;border-bottom:1px solid rgba(255,255,255,.06);'
  +   'background:rgba(14,122,62,.09)}'
  + '.ali-atalho a{display:flex;align-items:center;justify-content:center;gap:8px;min-height:38px;'
  +   'border-radius:99px;background:rgba(14,122,62,.16);border:1px solid rgba(78,199,125,.3);'
  +   'color:#7fe0a4;font-size:12.5px;font-weight:600;text-decoration:none;letter-spacing:.02em}'
  + '.ali-atalho a:hover{background:rgba(14,122,62,.26)}'
  + '.ali-atalho svg{width:15px;height:15px;flex:none}'
  + '.ali-c{flex:1;overflow-y:auto;padding:16px 15px;display:flex;flex-direction:column;gap:11px;'
  +   '-webkit-overflow-scrolling:touch}'
  + '.ali-m{max-width:86%;padding:10px 14px;border-radius:15px;font-size:14.5px;line-height:1.55;'
  +   'animation:ali-sobe .26s ease both;white-space:pre-wrap;word-wrap:break-word}'
  + '@keyframes ali-sobe{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}'
  + '.ali-m.ali-ele{align-self:flex-start;background:#1c1c20;color:#f1ece4;border-bottom-left-radius:4px}'
  + '.ali-m.ali-eu{align-self:flex-end;background:linear-gradient(140deg,#ffb454,#ff7a00);'
  +   'color:#150a00;border-bottom-right-radius:4px;font-weight:500}'
  + '.ali-pt{align-self:flex-start;display:flex;gap:4px;padding:13px 15px;background:#1c1c20;'
  +   'border-radius:15px;border-bottom-left-radius:4px}'
  + '.ali-pt i{width:6px;height:6px;border-radius:50%;background:#ff7a00;animation:ali-pisca 1.3s infinite}'
  + '.ali-pt i:nth-child(2){animation-delay:.18s}.ali-pt i:nth-child(3){animation-delay:.36s}'
  + '@keyframes ali-pisca{0%,60%,100%{opacity:.25}30%{opacity:1}}'
  + '.ali-m a.ali-link{color:#ffb454;text-decoration:underline;text-underline-offset:3px;word-break:break-all}'
  + '.ali-m a.ali-link:hover{color:#fff}'
  + '.ali-zap{display:inline-flex;align-items:center;gap:8px;margin-top:10px;min-height:42px;'
  +   'padding:10px 18px;border-radius:99px;background:#0e7a3e;color:#fff;font-size:13px;font-weight:600;'
  +   'text-decoration:none;box-shadow:0 6px 18px rgba(14,122,62,.32)}'
  + '.ali-zap:hover{background:#0b6b35}'
  + '.ali-zap svg{width:16px;height:16px;flex:none}'
  + '.ali-f{flex:none;display:flex;gap:8px;padding:11px 13px;border-top:1px solid rgba(255,255,255,.07);'
  +   'background:#111113}'
  + '.ali-f input{flex:1;min-height:44px;padding:11px 16px;border-radius:99px;background:#1c1c20;'
  +   'border:1px solid rgba(255,255,255,.09);color:#f1ece4;font-size:16px;font-family:inherit;outline:none}'
  + '.ali-f input::placeholder{color:#7b7770}'
  + '.ali-f input:focus{border-color:rgba(255,138,31,.5)}'
  + '.ali-f button{flex:none;width:44px;height:44px;border-radius:50%;border:0;cursor:pointer;'
  +   'background:linear-gradient(140deg,#ffb454,#ff7a00);color:#150a00;display:grid;place-items:center}'
  + '.ali-f button svg{width:19px;height:19px}'
  + '.ali-f button:disabled{opacity:.45;cursor:default}'
  + '.ali-mic{flex:none;width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,138,31,.35);'
  +   'cursor:pointer;background:transparent;color:#ff8a1f;display:grid;place-items:center}'
  + '.ali-mic svg{width:19px;height:19px}'
  + '.ali-mic:hover{background:rgba(255,138,31,.12)}'
  + '.ali-mic.ali-ouvindo{background:#b93636;border-color:#b93636;color:#fff;animation:ali-pulsa 1.4s infinite}'
  + '@keyframes ali-pulsa{0%,100%{box-shadow:0 0 0 0 rgba(185,54,54,.5)}70%{box-shadow:0 0 0 9px rgba(185,54,54,0)}}'
  + '.ali-mic[hidden]{display:none}'
  + '@media (max-width:420px){.ali-p{right:10px;left:10px;bottom:10px;width:auto;height:min(78dvh,560px)}'
  +   '.ali-orb{right:14px;bottom:14px}.ali-cv{max-width:150px;font-size:13px;padding:9px 13px}'
  +   '@keyframes ali-ronda{0%,8%{transform:translateX(0)}38%,54%{transform:translateX(-38vw)}84%,100%{transform:translateX(0)}}}'
  + '@media (prefers-reduced-motion:reduce){.ali-b,.ali-b::after,.ali-m,.ali-p,.ali-orb,.ali-olho,.ali-antena{animation:none!important}}';

  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* ---------------- ícones ---------------- */
  var icoRobo = '<span class="ali-logo"><img src="' + LOGO + '" alt="" width="60" height="72"></span>';
  var icoChat = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-4-.9L3 21l1.9-5a8.4 8.4 0 0 1-.9-4 8.4 8.4 0 0 1 8.4-8.4h.5a8.4 8.4 0 0 1 8.1 8z"/></svg>';
  var icoZap  = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-1.7-.9-2.9-1.6-4-3.6-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.5.7.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.5-.4z"/><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg>';
  var icoMic  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><rect x="9" y="2" width="6" height="11" rx="3" fill="currentColor" stroke="none"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/><path d="M8.5 21h7"/></svg>';
  var icoEnv  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/></svg>';

  /* ---------------- elementos ---------------- */
  var bolha = document.createElement('button');
  bolha.className = 'ali-b';
  bolha.setAttribute('aria-label', 'Falar com a Ali');
  bolha.innerHTML = icoRobo;

  var convite = document.createElement('div');
  convite.className = 'ali-cv';

  var painel = document.createElement('div');
  painel.className = 'ali-p';
  painel.setAttribute('role', 'dialog');
  painel.setAttribute('aria-label', 'Atendimento');
  painel.innerHTML =
      '<div class="ali-h">'
    +   '<div class="ali-av">' + icoRobo + '</div>'
    +   '<div class="ali-hn"><b>Ali</b><i>assistente virtual · responde na hora</i></div>'
    +   '<button class="ali-x" aria-label="Fechar">&times;</button>'
    + '</div>'
    + '<div class="ali-atalho">'
    +   '<a href="https://wa.me/' + WHATS + '?text=' + encodeURIComponent('Olá! Vim ' + DE + ' da Esquadrias Uberaba.') + '" target="_blank" rel="noopener">'
    +     icoZap + 'Prefiro falar direto no WhatsApp</a>'
    + '</div>'
    + '<div class="ali-c"></div>'
    + '<form class="ali-f"><input type="text" placeholder="Escreva aqui" autocomplete="off">'
    +   '<button type="button" class="ali-mic" aria-label="Falar" hidden>' + icoMic + '</button>'
    +   '<button type="submit" aria-label="Enviar">' + icoEnv + '</button></form>';

  var orbita = document.createElement('div');
  orbita.className = 'ali-orb ali-parado';
  orbita.style.bottom = BASE + 'px';
  orbita.appendChild(bolha);
  orbita.appendChild(convite);

  document.body.appendChild(orbita);
  document.body.appendChild(painel);

  // o widget substitui o botao flutuante de WhatsApp da pagina, se houver
  ['.wa-float', '.whatsapp-float', '.btn-whats-float', '.zap'].forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) { el.style.display = 'none'; });
  });

  // a ronda para assim que a pessoa interage, e nao volta mais
  function pararRonda() { orbita.classList.add('ali-parado'); }
  orbita.addEventListener('pointerenter', pararRonda);
  orbita.addEventListener('pointerdown', pararRonda);

  var corpo  = painel.querySelector('.ali-c');
  var form   = painel.querySelector('.ali-f');
  var campo  = form.querySelector('input');
  var enviar = form.querySelector('button');
  var fechar = painel.querySelector('.ali-x');
  var mic    = painel.querySelector('.ali-mic');
  var tocando = null;

  var aberto = false, ocupado = false, jaAbriu = false, iConvite = 0, giro = null;

  /* ---------------- convite rotativo ---------------- */
  function mostraConvite() {
    if (aberto || jaAbriu) return;
    convite.textContent = CONVITES[iConvite % CONVITES.length];
    convite.classList.add('ali-ver');
    setTimeout(function () { convite.classList.remove('ali-ver'); }, 4200);
    iConvite++;
    if (iConvite >= CONVITES.length) { clearInterval(giro); giro = null; }
  }

  var comecou = false;
  function comecarConvites() {
    if (comecou || jaAbriu) return;
    comecou = true;
    mostraConvite();
    giro = setInterval(mostraConvite, 13000);
  }
  setTimeout(comecarConvites, 8000);
  window.addEventListener('scroll', function aoRolar() {
    if (window.scrollY > window.innerHeight * 0.4) {
      comecarConvites();
      window.removeEventListener('scroll', aoRolar);
    }
  }, { passive: true });

  /* ---------------- mensagens ---------------- */
  function comLinks(texto) {
    // transforma endereco em link clicavel, sem deixar passar HTML da resposta
    var caixa = document.createElement('span');
    var re = /https?:\/\/[^\s<>"')]+/g;
    var pos = 0, m;
    while ((m = re.exec(texto)) !== null) {
      if (m.index > pos) caixa.appendChild(document.createTextNode(texto.slice(pos, m.index)));
      var url = m[0].replace(/[.,;:)]+$/, '');
      var a = document.createElement('a');
      a.className = 'ali-link';
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = url.replace(/^https?:\/\//, '');
      caixa.appendChild(a);
      pos = m.index + url.length;
    }
    if (pos < texto.length) caixa.appendChild(document.createTextNode(texto.slice(pos)));
    return caixa;
  }

  function msg(quem, texto) {
    var d = document.createElement('div');
    d.className = 'ali-m ali-' + quem;
    d.appendChild(comLinks(texto));
    corpo.appendChild(d);
    corpo.scrollTop = corpo.scrollHeight;
    return d;
  }

  function botaoZap(dados) {
    var a = document.createElement('a');
    a.className = 'ali-zap';
    a.href = dados.link;
    a.target = '_blank';
    a.rel = 'noopener';
    a.innerHTML = icoZap + 'Falar no WhatsApp';
    return a;
  }

  function abrir() {
    aberto = true;
    painel.classList.add('ali-ver');
    orbita.classList.add('ali-off');
    convite.classList.remove('ali-ver');
    if (giro) { clearInterval(giro); giro = null; }
    pararRonda();
    if (!jaAbriu) { jaAbriu = true; msg('ele', ABERTURA); }
    setTimeout(function () { campo.focus(); }, 120);
  }

  function fecharPainel() {
    aberto = false;
    painel.classList.remove('ali-ver');
    orbita.classList.remove('ali-off');
  }

  bolha.addEventListener('click', abrir);
  convite.addEventListener('click', abrir);
  fechar.addEventListener('click', fecharPainel);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && aberto) fecharPainel();
  });

  /* ---------------- conversa ---------------- */
  function tocar(base64) {
    try {
      if (tocando) { tocando.pause(); tocando = null; }
      var a = new Audio('data:audio/mpeg;base64,' + base64);
      tocando = a;
      a.onended = function () { tocando = null; };
      a.play().catch(function () { tocando = null; });
    } catch (e) { tocando = null; }
  }

  function enviarAudio(base64, mimeType) {
    if (ocupado) return;
    ocupado = true;
    enviar.disabled = true;

    var minha = msg('eu', 'Áudio enviado');
    var pensando = document.createElement('div');
    pensando.className = 'ali-pt';
    pensando.innerHTML = '<i></i><i></i><i></i>';
    corpo.appendChild(pensando);
    corpo.scrollTop = corpo.scrollHeight;

    var corpoReq = { audio: base64, mimeType: mimeType, sessao: SESSAO };
    corpoReq.origem = ORIGEM;

    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpoReq)
    })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        pensando.remove();
        if (d.ouvido) minha.textContent = d.ouvido;   // mostra o que foi entendido
        var bloco = msg('ele', (d.resposta || '').trim()
          || 'Não consegui entender o áudio. Pode repetir?');
        if (d.audio) tocar(d.audio);
        if (d.whatsapp && d.whatsapp.link) {
          bloco.appendChild(document.createElement('br'));
          bloco.appendChild(botaoZap(d.whatsapp));
        }
      })
      .catch(function () {
        pensando.remove();
        msg('ele', 'Tive um problema de conexão. Pode tentar de novo?');
      })
      .then(function () {
        ocupado = false;
        enviar.disabled = false;
        corpo.scrollTop = corpo.scrollHeight;
      });
  }

  function perguntar(texto, modo) {
    if (!texto || ocupado) return;
    modo = modo || 'texto';
    ocupado = true;
    enviar.disabled = true;
    msg('eu', texto);

    var pensando = document.createElement('div');
    pensando.className = 'ali-pt';
    pensando.innerHTML = '<i></i><i></i><i></i>';
    corpo.appendChild(pensando);
    corpo.scrollTop = corpo.scrollHeight;

    var corpoReq = { mensagem: texto, sessao: SESSAO, modo: modo };
    corpoReq.origem = ORIGEM;

    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpoReq)
    })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        pensando.remove();
        var bloco = msg('ele', (d.resposta || '').trim()
          || 'Não consegui responder agora. Pode repetir?');
        if (d.audio) tocar(d.audio);
        if (d.whatsapp && d.whatsapp.link) {
          bloco.appendChild(document.createElement('br'));
          bloco.appendChild(botaoZap(d.whatsapp));
          corpo.scrollTop = corpo.scrollHeight;
        }
      })
      .catch(function () {
        pensando.remove();
        var b = msg('ele', 'Tive um problema de conexão. Se preferir, fale direto no WhatsApp:');
        b.appendChild(document.createElement('br'));
        b.appendChild(botaoZap({
          link: 'https://wa.me/' + WHATS + '?text=' + encodeURIComponent('Olá! Vim ' + DE + ' da Esquadrias Uberaba.')
        }));
      })
      .then(function () {
        ocupado = false;
        enviar.disabled = false;
        corpo.scrollTop = corpo.scrollHeight;
      });
  }

  /* ---------------- gravar audio de verdade ---------------- */
  var gravador = null, pedacos = [], gravando = false, faixa = null, tempoInicio = 0;

  function podeGravar() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
  }

  if (podeGravar()) mic.hidden = false;

  function tipoSuportado() {
    var tipos = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'];
    for (var i = 0; i < tipos.length; i++) {
      if (MediaRecorder.isTypeSupported(tipos[i])) return tipos[i];
    }
    return '';
  }

  function pararTudo() {
    if (faixa) { faixa.getTracks().forEach(function (t) { t.stop() }); faixa = null; }
    gravando = false;
    mic.classList.remove('ali-ouvindo');
    campo.placeholder = 'Escreva aqui';
  }

  async function comecarGravacao() {
    try {
      faixa = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      msg('ele', 'Preciso da sua permissão para usar o microfone. Toque no cadeado ao lado do endereço do site, libere o microfone e recarregue a página. Se preferir, é só escrever aqui embaixo.');
      return;
    }
    var tipo = tipoSuportado();
    try {
      gravador = tipo ? new MediaRecorder(faixa, { mimeType: tipo }) : new MediaRecorder(faixa);
    } catch (e) {
      pararTudo();
      msg('ele', 'Este navegador não conseguiu gravar áudio. Pode escrever aqui embaixo?');
      return;
    }

    pedacos = [];
    tempoInicio = Date.now();
    gravador.ondataavailable = function (ev) { if (ev.data && ev.data.size) pedacos.push(ev.data); };
    gravador.onstop = function () {
      var duracao = Date.now() - tempoInicio;
      var blob = new Blob(pedacos, { type: gravador.mimeType || 'audio/webm' });
      pararTudo();
      if (duracao < 700 || blob.size < 1200) {
        campo.placeholder = 'Segure um instante a mais para gravar';
        return;
      }
      var leitor = new FileReader();
      leitor.onloadend = function () {
        var base64 = String(leitor.result).split(',')[1];
        enviarAudio(base64, (gravador.mimeType || 'audio/webm').split(';')[0]);
      };
      leitor.readAsDataURL(blob);
    };

    gravador.start();
    gravando = true;
    mic.classList.add('ali-ouvindo');
    campo.placeholder = 'Gravando, toque de novo para enviar';
  }

  function encerrarGravacao() {
    if (gravador && gravador.state === 'recording') gravador.stop();
    else pararTudo();
  }

  mic.addEventListener('click', function () {
    if (tocando) { tocando.pause(); tocando = null; return; }
    if (ocupado) return;
    if (gravando) { encerrarGravacao(); return; }
    comecarGravacao();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var t = campo.value.trim();
    if (!t) return;
    campo.value = '';
    perguntar(t);
  });
})();

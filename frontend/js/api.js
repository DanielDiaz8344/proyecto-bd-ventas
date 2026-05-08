// ============================================================================
// api.js - Helper para todas las llamadas al backend
// ============================================================================

const API_BASE = '/api';

async function request(method, path, body = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    if (body) options.body = JSON.stringify(body);

    const res  = await fetch(API_BASE + path, options);
    const data = res.status === 204 ? null : await res.json();

    if (!res.ok) {
        throw new Error(data?.error || 'Error en la petición');
    }
    return data;
}

const api = {
    get:    (path)        => request('GET',    path),
    post:   (path, body)  => request('POST',   path, body),
    put:    (path, body)  => request('PUT',    path, body),
    delete: (path)        => request('DELETE', path)
};

function mostrarMensaje(texto, tipo = 'success') {
    const div = document.createElement('div');
    div.className = `alert alert-${tipo} alert-dismissible fade show position-fixed top-0 end-0 m-3 shadow`;
    div.style.zIndex = 1080;
    div.innerHTML = `${texto}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 4000);
}

function formatoMoneda(n) {
    return '$' + Number(n).toFixed(2);
}

function formatoFecha(fecha) {
    return new Date(fecha).toLocaleString('es-VE');
}

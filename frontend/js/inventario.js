// ============================================================================
// inventario.js - Stock, alertas y kardex
// ============================================================================

document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([cargarStock(), cargarAlertas(), cargarSelectProductos()]);
});

async function cargarStock() {
    try {
        const stock = await api.get('/inventario');
        const tbody = document.getElementById('tabla-stock');
        if (stock.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted py-4">Sin stock registrado</td></tr>';
            return;
        }
        tbody.innerHTML = stock.map(s => {
            let cls = '';
            if (s.cantidad === 0) cls = 'stock-critico';
            else if (s.cantidad <= s.stock_minimo) cls = 'stock-bajo';
            return `
                <tr class="${cls}">
                    <td><code>${s.codigo}</code></td>
                    <td>${s.producto}</td>
                    <td>${s.almacen}</td>
                    <td>${s.ubicacion || '-'}</td>
                    <td class="text-end fw-bold">${s.cantidad}</td>
                    <td class="text-end">${s.stock_minimo}</td>
                    <td class="text-end">${s.stock_maximo || '-'}</td>
                    <td><small>${formatoFecha(s.fecha_actualizacion)}</small></td>
                </tr>
            `;
        }).join('');
    } catch (err) {
        mostrarMensaje(err.message, 'danger');
    }
}

async function cargarAlertas() {
    try {
        const alertas = await api.get('/inventario/alertas');
        document.getElementById('badge-alertas').textContent = alertas.length;
        const tbody = document.getElementById('tabla-alertas');
        if (alertas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-success py-4"><i class="bi bi-check-circle"></i> No hay productos en alerta</td></tr>';
            return;
        }
        tbody.innerHTML = alertas.map(a => `
            <tr class="stock-bajo">
                <td><code>${a.codigo}</code></td>
                <td>${a.producto}</td>
                <td>${a.almacen}</td>
                <td class="text-end fw-bold text-danger">${a.stock_actual}</td>
                <td class="text-end">${a.stock_minimo}</td>
            </tr>
        `).join('');
    } catch (err) {
        mostrarMensaje(err.message, 'danger');
    }
}

async function cargarSelectProductos() {
    try {
        const productos = await api.get('/productos');
        const select = document.getElementById('select-producto-kardex');
        select.innerHTML = '<option value="">Seleccione un producto...</option>' +
            productos.map(p => `<option value="${p.id}">${p.codigo} - ${p.nombre}</option>`).join('');
    } catch (err) {
        console.error(err);
    }
}

async function cargarKardex() {
    const idProducto = document.getElementById('select-producto-kardex').value;
    const tbody = document.getElementById('tabla-kardex');
    if (!idProducto) {
        tbody.innerHTML = '';
        return;
    }
    try {
        const kardex = await api.get(`/inventario/kardex/${idProducto}`);
        if (kardex.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">Sin movimientos</td></tr>';
            return;
        }
        tbody.innerHTML = kardex.map(m => {
            const badge = m.tipo === 'entrada' ? 'success' : (m.tipo === 'salida' ? 'danger' : 'secondary');
            return `
                <tr>
                    <td><small>${formatoFecha(m.fecha)}</small></td>
                    <td><span class="badge bg-${badge}">${m.tipo}</span></td>
                    <td>${m.almacen}</td>
                    <td class="text-end">${m.cantidad}</td>
                    <td class="text-end">${m.costo_unitario ? formatoMoneda(m.costo_unitario) : '-'}</td>
                    <td><small>${m.referencia || '-'}</small></td>
                    <td><small>${m.usuario}</small></td>
                </tr>
            `;
        }).join('');
    } catch (err) {
        mostrarMensaje(err.message, 'danger');
    }
}

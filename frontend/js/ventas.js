// ============================================================================
// ventas.js - Listado de ventas
// ============================================================================

document.addEventListener('DOMContentLoaded', cargar);

async function cargar() {
    try {
        const ventas = await api.get('/ventas');
        const tbody = document.getElementById('tabla-ventas');
        if (ventas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted py-4">Sin ventas registradas</td></tr>';
            return;
        }
        tbody.innerHTML = ventas.map(v => {
            const estadoBadge = v.estado === 'pagada'   ? 'success'
                              : v.estado === 'anulada'  ? 'danger'
                              : 'warning text-dark';
            return `
                <tr>
                    <td><code>${v.numero_factura}</code></td>
                    <td><small>${formatoFecha(v.fecha)}</small></td>
                    <td>${v.cliente_nombre}</td>
                    <td>${v.vendedor}</td>
                    <td><span class="badge bg-light text-dark">${v.metodo_pago || '-'}</span></td>
                    <td class="text-end fw-bold">${formatoMoneda(v.total)}</td>
                    <td><span class="badge bg-${estadoBadge}">${v.estado}</span></td>
                    <td class="tabla-acciones">
                        <button class="btn btn-outline-info" onclick="verDetalle(${v.id})"><i class="bi bi-eye"></i></button>
                        ${v.estado === 'pagada' ? `<button class="btn btn-outline-danger" onclick="anular(${v.id})"><i class="bi bi-x-circle"></i></button>` : ''}
                    </td>
                </tr>
            `;
        }).join('');
    } catch (err) {
        mostrarMensaje(err.message, 'danger');
    }
}

async function verDetalle(id) {
    try {
        const v = await api.get(`/ventas/${id}`);
        document.getElementById('detalle-titulo').textContent = `Factura ${v.numero_factura}`;
        document.getElementById('detalle-cuerpo').innerHTML = `
            <div class="row mb-3">
                <div class="col-md-6">
                    <strong>Cliente:</strong> ${v.cliente_nombre}<br>
                    <strong>Cédula:</strong> ${v.cliente_cedula}<br>
                    <strong>Fecha:</strong> ${formatoFecha(v.fecha)}
                </div>
                <div class="col-md-6 text-md-end">
                    <strong>Vendedor:</strong> ${v.vendedor}<br>
                    <strong>Pago:</strong> ${v.metodo_pago || '-'}<br>
                    <strong>Estado:</strong> ${v.estado}
                </div>
            </div>
            <table class="table table-sm">
                <thead class="table-light">
                    <tr>
                        <th>Producto</th>
                        <th class="text-end">Cant.</th>
                        <th class="text-end">P. Unit.</th>
                        <th class="text-end">Desc.</th>
                        <th class="text-end">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${v.detalles.map(d => `
                        <tr>
                            <td><code>${d.codigo}</code> ${d.producto_nombre}</td>
                            <td class="text-end">${d.cantidad}</td>
                            <td class="text-end">${formatoMoneda(d.precio_unitario)}</td>
                            <td class="text-end">${formatoMoneda(d.descuento_linea)}</td>
                            <td class="text-end">${formatoMoneda(d.subtotal)}</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                    <tr><td colspan="4" class="text-end">Subtotal:</td><td class="text-end">${formatoMoneda(v.subtotal)}</td></tr>
                    <tr><td colspan="4" class="text-end">Descuento:</td><td class="text-end">-${formatoMoneda(v.descuento)}</td></tr>
                    <tr><td colspan="4" class="text-end">Impuesto:</td><td class="text-end">${formatoMoneda(v.impuesto)}</td></tr>
                    <tr class="fw-bold"><td colspan="4" class="text-end">TOTAL:</td><td class="text-end">${formatoMoneda(v.total)}</td></tr>
                </tfoot>
            </table>
        `;
        new bootstrap.Modal(document.getElementById('modalDetalle')).show();
    } catch (err) {
        mostrarMensaje(err.message, 'danger');
    }
}

async function anular(id) {
    if (!confirm('¿Anular esta venta? Esta acción no se puede deshacer.')) return;
    try {
        await api.put(`/ventas/${id}/anular`);
        mostrarMensaje('Venta anulada');
        await cargar();
    } catch (err) {
        mostrarMensaje(err.message, 'danger');
    }
}

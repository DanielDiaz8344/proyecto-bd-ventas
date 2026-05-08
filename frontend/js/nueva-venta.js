// ============================================================================
// nueva-venta.js - Carrito y registro transaccional de venta
// ============================================================================

let productos = [];
let carrito   = [];

document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([cargarSelects(), generarNumeroFactura()]);
});

async function cargarSelects() {
    try {
        const [clientes, usuarios, almacenes, prods] = await Promise.all([
            api.get('/clientes'),
            api.get('/usuarios'),
            api.get('/almacenes'),
            api.get('/productos')
        ]);
        productos = prods;

        document.getElementById('select-cliente').innerHTML =
            '<option value="">Seleccione cliente...</option>' +
            clientes.map(c => `<option value="${c.id}">${c.cedula} - ${c.nombre}</option>`).join('');

        document.getElementById('select-usuario').innerHTML =
            usuarios.filter(u => u.estado).map(u => `<option value="${u.id}">${u.nombre_completo}</option>`).join('');

        document.getElementById('select-almacen').innerHTML =
            almacenes.map(a => `<option value="${a.id}">${a.nombre}</option>`).join('');

        document.getElementById('select-producto').innerHTML =
            '<option value="">Seleccione producto...</option>' +
            productos.map(p => `<option value="${p.id}" data-precio="${p.precio_venta}">${p.codigo} - ${p.nombre} (${formatoMoneda(p.precio_venta)})</option>`).join('');

        document.getElementById('select-producto').addEventListener('change', (e) => {
            const opt = e.target.selectedOptions[0];
            if (opt && opt.dataset.precio) {
                document.getElementById('input-precio').value = opt.dataset.precio;
            }
        });
    } catch (err) {
        mostrarMensaje(err.message, 'danger');
    }
}

function generarNumeroFactura() {
    const ahora = new Date();
    const sufijo = String(ahora.getTime()).slice(-4);
    document.getElementById('numero-factura').value = `FAC-${ahora.getFullYear()}-${sufijo}`;
}

function agregarItem() {
    const idProducto = parseInt(document.getElementById('select-producto').value);
    const cantidad   = parseInt(document.getElementById('input-cantidad').value);
    const precio     = parseFloat(document.getElementById('input-precio').value);

    if (!idProducto || !cantidad || !precio) {
        mostrarMensaje('Complete producto, cantidad y precio', 'warning');
        return;
    }

    const producto = productos.find(p => p.id === idProducto);
    const existente = carrito.find(i => i.id_producto === idProducto);

    if (existente) {
        existente.cantidad += cantidad;
        existente.subtotal = existente.cantidad * existente.precio_unitario;
    } else {
        carrito.push({
            id_producto:     idProducto,
            codigo:          producto.codigo,
            nombre:          producto.nombre,
            cantidad,
            precio_unitario: precio,
            descuento_linea: 0,
            subtotal:        cantidad * precio
        });
    }

    document.getElementById('select-producto').value = '';
    document.getElementById('input-cantidad').value  = 1;
    document.getElementById('input-precio').value    = '';

    renderCarrito();
}

function quitarItem(idx) {
    carrito.splice(idx, 1);
    renderCarrito();
}

function renderCarrito() {
    const tbody = document.getElementById('tabla-carrito');
    if (carrito.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-3">Carrito vacío</td></tr>';
    } else {
        tbody.innerHTML = carrito.map((i, idx) => `
            <tr>
                <td><small><code>${i.codigo}</code> ${i.nombre}</small></td>
                <td class="text-end">${i.cantidad}</td>
                <td class="text-end">${formatoMoneda(i.precio_unitario)}</td>
                <td class="text-end">${formatoMoneda(i.subtotal)}</td>
                <td><button class="btn btn-sm btn-outline-danger" onclick="quitarItem(${idx})"><i class="bi bi-x"></i></button></td>
            </tr>
        `).join('');
    }
    actualizarTotales();
}

function actualizarTotales() {
    const subtotal = carrito.reduce((s, i) => s + i.subtotal, 0);
    const desc     = parseFloat(document.getElementById('r-descuento').value) || 0;
    const imp      = parseFloat(document.getElementById('r-impuesto').value)  || 0;
    const total    = subtotal - desc + imp;

    document.getElementById('r-subtotal').textContent = formatoMoneda(subtotal);
    document.getElementById('r-total').textContent    = formatoMoneda(total);
}

async function registrar() {
    if (carrito.length === 0) {
        mostrarMensaje('Agregue al menos un producto', 'warning');
        return;
    }

    const body = {
        numero_factura: document.getElementById('numero-factura').value,
        id_cliente:     parseInt(document.getElementById('select-cliente').value),
        id_usuario:     parseInt(document.getElementById('select-usuario').value),
        id_almacen:     parseInt(document.getElementById('select-almacen').value),
        descuento:      parseFloat(document.getElementById('r-descuento').value) || 0,
        impuesto:       parseFloat(document.getElementById('r-impuesto').value)  || 0,
        metodo_pago:    document.getElementById('select-pago').value,
        items:          carrito.map(i => ({
            id_producto:     i.id_producto,
            cantidad:        i.cantidad,
            precio_unitario: i.precio_unitario,
            descuento_linea: i.descuento_linea
        }))
    };

    if (!body.numero_factura || !body.id_cliente || !body.id_usuario || !body.id_almacen) {
        mostrarMensaje('Complete todos los datos de la factura', 'warning');
        return;
    }

    document.getElementById('btn-registrar').disabled = true;

    try {
        await api.post('/ventas', body);
        mostrarMensaje('Venta registrada correctamente');
        setTimeout(() => window.location.href = 'ventas.html', 1200);
    } catch (err) {
        mostrarMensaje(err.message, 'danger');
        document.getElementById('btn-registrar').disabled = false;
    }
}

renderCarrito();

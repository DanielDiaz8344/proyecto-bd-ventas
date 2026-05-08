// ============================================================================
// productos.js - CRUD productos
// ============================================================================

let productos = [];
let categorias = [];

document.addEventListener('DOMContentLoaded', async () => {
    await cargarCategorias();
    await cargarProductos();
    document.getElementById('form-producto').addEventListener('submit', guardar);
});

async function cargarCategorias() {
    categorias = await api.get('/categorias');
    const select = document.getElementById('producto-categoria');
    select.innerHTML = '<option value="">Seleccione...</option>' +
        categorias.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
}

async function cargarProductos() {
    try {
        productos = await api.get('/productos');
        const tbody = document.getElementById('tabla-productos');
        if (productos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">Sin productos registrados</td></tr>';
            return;
        }
        tbody.innerHTML = productos.map(p => `
            <tr>
                <td><code>${p.codigo}</code></td>
                <td>${p.nombre}</td>
                <td><span class="badge bg-secondary">${p.categoria_nombre}</span></td>
                <td class="text-end">${formatoMoneda(p.precio_venta)}</td>
                <td class="text-end">${p.stock_minimo}</td>
                <td>${p.unidad_medida || '-'}</td>
                <td class="tabla-acciones">
                    <button class="btn btn-outline-primary" onclick="editar(${p.id})"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-outline-danger" onclick="eliminar(${p.id})"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        mostrarMensaje(err.message, 'danger');
    }
}

function abrirModalCrear() {
    document.getElementById('modal-titulo').textContent = 'Nuevo producto';
    document.getElementById('form-producto').reset();
    document.getElementById('producto-id').value = '';
}

function editar(id) {
    const p = productos.find(x => x.id === id);
    if (!p) return;
    document.getElementById('modal-titulo').textContent = 'Editar producto';
    document.getElementById('producto-id').value             = p.id;
    document.getElementById('producto-codigo').value         = p.codigo;
    document.getElementById('producto-nombre').value         = p.nombre;
    document.getElementById('producto-descripcion').value    = p.descripcion || '';
    document.getElementById('producto-precio-venta').value   = p.precio_venta;
    document.getElementById('producto-precio-compra').value  = p.precio_compra || '';
    document.getElementById('producto-categoria').value      = p.id_categoria;
    document.getElementById('producto-stock-min').value      = p.stock_minimo;
    document.getElementById('producto-stock-max').value      = p.stock_maximo || '';
    document.getElementById('producto-unidad').value         = p.unidad_medida || '';
    new bootstrap.Modal(document.getElementById('modalProducto')).show();
}

async function guardar(e) {
    e.preventDefault();
    const id = document.getElementById('producto-id').value;
    const body = {
        codigo:         document.getElementById('producto-codigo').value,
        nombre:         document.getElementById('producto-nombre').value,
        descripcion:    document.getElementById('producto-descripcion').value,
        precio_venta:   parseFloat(document.getElementById('producto-precio-venta').value),
        precio_compra:  parseFloat(document.getElementById('producto-precio-compra').value) || null,
        id_categoria:   parseInt(document.getElementById('producto-categoria').value),
        stock_minimo:   parseInt(document.getElementById('producto-stock-min').value) || 0,
        stock_maximo:   parseInt(document.getElementById('producto-stock-max').value) || null,
        unidad_medida:  document.getElementById('producto-unidad').value
    };
    try {
        if (id) {
            await api.put(`/productos/${id}`, body);
            mostrarMensaje('Producto actualizado');
        } else {
            await api.post('/productos', body);
            mostrarMensaje('Producto creado');
        }
        bootstrap.Modal.getInstance(document.getElementById('modalProducto')).hide();
        await cargarProductos();
    } catch (err) {
        mostrarMensaje(err.message, 'danger');
    }
}

async function eliminar(id) {
    if (!confirm('¿Desactivar este producto?')) return;
    try {
        await api.delete(`/productos/${id}`);
        mostrarMensaje('Producto desactivado');
        await cargarProductos();
    } catch (err) {
        mostrarMensaje(err.message, 'danger');
    }
}

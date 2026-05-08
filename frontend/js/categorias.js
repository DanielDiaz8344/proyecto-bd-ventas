// ============================================================================
// categorias.js - CRUD categorías
// ============================================================================

let categorias = [];

document.addEventListener('DOMContentLoaded', async () => {
    await cargar();
    document.getElementById('form-categoria').addEventListener('submit', guardar);
});

async function cargar() {
    try {
        categorias = await api.get('/categorias');
        const tbody = document.getElementById('tabla-categorias');
        if (categorias.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted py-4">Sin categorías registradas</td></tr>';
            return;
        }
        tbody.innerHTML = categorias.map(c => `
            <tr>
                <td><strong>${c.nombre}</strong></td>
                <td>${c.descripcion || '-'}</td>
                <td class="tabla-acciones">
                    <button class="btn btn-outline-primary" onclick="editar(${c.id})"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-outline-danger" onclick="eliminar(${c.id})"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        mostrarMensaje(err.message, 'danger');
    }
}

function abrirModalCrear() {
    document.getElementById('modal-titulo').textContent = 'Nueva categoría';
    document.getElementById('form-categoria').reset();
    document.getElementById('cat-id').value = '';
}

function editar(id) {
    const c = categorias.find(x => x.id === id);
    if (!c) return;
    document.getElementById('modal-titulo').textContent = 'Editar categoría';
    document.getElementById('cat-id').value          = c.id;
    document.getElementById('cat-nombre').value      = c.nombre;
    document.getElementById('cat-descripcion').value = c.descripcion || '';
    new bootstrap.Modal(document.getElementById('modalCategoria')).show();
}

async function guardar(e) {
    e.preventDefault();
    const id = document.getElementById('cat-id').value;
    const body = {
        nombre:      document.getElementById('cat-nombre').value,
        descripcion: document.getElementById('cat-descripcion').value
    };
    try {
        if (id) {
            await api.put(`/categorias/${id}`, body);
            mostrarMensaje('Categoría actualizada');
        } else {
            await api.post('/categorias', body);
            mostrarMensaje('Categoría creada');
        }
        bootstrap.Modal.getInstance(document.getElementById('modalCategoria')).hide();
        await cargar();
    } catch (err) {
        mostrarMensaje(err.message, 'danger');
    }
}

async function eliminar(id) {
    if (!confirm('¿Eliminar esta categoría?')) return;
    try {
        await api.delete(`/categorias/${id}`);
        mostrarMensaje('Categoría eliminada');
        await cargar();
    } catch (err) {
        mostrarMensaje(err.message, 'danger');
    }
}

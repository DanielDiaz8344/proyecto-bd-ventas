// ============================================================================
// clientes.js - CRUD clientes
// ============================================================================

let clientes = [];

document.addEventListener('DOMContentLoaded', async () => {
    await cargar();
    document.getElementById('form-cliente').addEventListener('submit', guardar);
});

async function cargar() {
    try {
        clientes = await api.get('/clientes');
        const tbody = document.getElementById('tabla-clientes');
        if (clientes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">Sin clientes registrados</td></tr>';
            return;
        }
        tbody.innerHTML = clientes.map(c => `
            <tr>
                <td><code>${c.cedula}</code></td>
                <td>${c.nombre}</td>
                <td>${c.apellido || '-'}</td>
                <td>${c.telefono || '-'}</td>
                <td>${c.email || '-'}</td>
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
    document.getElementById('modal-titulo').textContent = 'Nuevo cliente';
    document.getElementById('form-cliente').reset();
    document.getElementById('cliente-id').value = '';
}

function editar(id) {
    const c = clientes.find(x => x.id === id);
    if (!c) return;
    document.getElementById('modal-titulo').textContent = 'Editar cliente';
    document.getElementById('cliente-id').value        = c.id;
    document.getElementById('cliente-cedula').value    = c.cedula;
    document.getElementById('cliente-nombre').value    = c.nombre;
    document.getElementById('cliente-apellido').value  = c.apellido || '';
    document.getElementById('cliente-telefono').value  = c.telefono || '';
    document.getElementById('cliente-email').value     = c.email || '';
    document.getElementById('cliente-direccion').value = c.direccion || '';
    new bootstrap.Modal(document.getElementById('modalCliente')).show();
}

async function guardar(e) {
    e.preventDefault();
    const id = document.getElementById('cliente-id').value;
    const body = {
        cedula:    document.getElementById('cliente-cedula').value,
        nombre:    document.getElementById('cliente-nombre').value,
        apellido:  document.getElementById('cliente-apellido').value,
        telefono:  document.getElementById('cliente-telefono').value,
        email:     document.getElementById('cliente-email').value,
        direccion: document.getElementById('cliente-direccion').value
    };
    try {
        if (id) {
            await api.put(`/clientes/${id}`, body);
            mostrarMensaje('Cliente actualizado');
        } else {
            await api.post('/clientes', body);
            mostrarMensaje('Cliente creado');
        }
        bootstrap.Modal.getInstance(document.getElementById('modalCliente')).hide();
        await cargar();
    } catch (err) {
        mostrarMensaje(err.message, 'danger');
    }
}

async function eliminar(id) {
    if (!confirm('¿Desactivar este cliente?')) return;
    try {
        await api.delete(`/clientes/${id}`);
        mostrarMensaje('Cliente desactivado');
        await cargar();
    } catch (err) {
        mostrarMensaje(err.message, 'danger');
    }
}

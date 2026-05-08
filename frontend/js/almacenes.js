// ============================================================================
// almacenes.js - CRUD almacenes
// ============================================================================

let almacenes = [];

document.addEventListener('DOMContentLoaded', async () => {
    await cargar();
    document.getElementById('form-almacen').addEventListener('submit', guardar);
});

async function cargar() {
    try {
        almacenes = await api.get('/almacenes');
        const tbody = document.getElementById('tabla-almacenes');
        if (almacenes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">Sin almacenes registrados</td></tr>';
            return;
        }
        tbody.innerHTML = almacenes.map(a => `
            <tr>
                <td><strong>${a.nombre}</strong></td>
                <td>${a.direccion || '-'}</td>
                <td>${a.encargado || '-'}</td>
                <td class="text-end">${a.capacidad || '-'}</td>
                <td class="tabla-acciones">
                    <button class="btn btn-outline-primary" onclick="editar(${a.id})"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-outline-danger" onclick="eliminar(${a.id})"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        mostrarMensaje(err.message, 'danger');
    }
}

function abrirModalCrear() {
    document.getElementById('modal-titulo').textContent = 'Nuevo almacén';
    document.getElementById('form-almacen').reset();
    document.getElementById('alm-id').value = '';
}

function editar(id) {
    const a = almacenes.find(x => x.id === id);
    if (!a) return;
    document.getElementById('modal-titulo').textContent = 'Editar almacén';
    document.getElementById('alm-id').value        = a.id;
    document.getElementById('alm-nombre').value    = a.nombre;
    document.getElementById('alm-direccion').value = a.direccion || '';
    document.getElementById('alm-encargado').value = a.encargado || '';
    document.getElementById('alm-capacidad').value = a.capacidad || '';
    new bootstrap.Modal(document.getElementById('modalAlmacen')).show();
}

async function guardar(e) {
    e.preventDefault();
    const id = document.getElementById('alm-id').value;
    const body = {
        nombre:    document.getElementById('alm-nombre').value,
        direccion: document.getElementById('alm-direccion').value,
        encargado: document.getElementById('alm-encargado').value,
        capacidad: parseInt(document.getElementById('alm-capacidad').value) || null
    };
    try {
        if (id) {
            await api.put(`/almacenes/${id}`, body);
            mostrarMensaje('Almacén actualizado');
        } else {
            await api.post('/almacenes', body);
            mostrarMensaje('Almacén creado');
        }
        bootstrap.Modal.getInstance(document.getElementById('modalAlmacen')).hide();
        await cargar();
    } catch (err) {
        mostrarMensaje(err.message, 'danger');
    }
}

async function eliminar(id) {
    if (!confirm('¿Eliminar este almacén?')) return;
    try {
        await api.delete(`/almacenes/${id}`);
        mostrarMensaje('Almacén eliminado');
        await cargar();
    } catch (err) {
        mostrarMensaje(err.message, 'danger');
    }
}

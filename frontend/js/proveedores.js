// ============================================================================
// proveedores.js - CRUD proveedores
// ============================================================================

let proveedores = [];

document.addEventListener('DOMContentLoaded', async () => {
    await cargar();
    document.getElementById('form-proveedor').addEventListener('submit', guardar);
});

async function cargar() {
    try {
        proveedores = await api.get('/proveedores');
        const tbody = document.getElementById('tabla-proveedores');
        if (proveedores.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">Sin proveedores registrados</td></tr>';
            return;
        }
        tbody.innerHTML = proveedores.map(p => `
            <tr>
                <td><code>${p.rif}</code></td>
                <td>${p.nombre}</td>
                <td>${p.contacto || '-'}</td>
                <td>${p.telefono || '-'}</td>
                <td>${p.email || '-'}</td>
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
    document.getElementById('modal-titulo').textContent = 'Nuevo proveedor';
    document.getElementById('form-proveedor').reset();
    document.getElementById('prov-id').value = '';
}

function editar(id) {
    const p = proveedores.find(x => x.id === id);
    if (!p) return;
    document.getElementById('modal-titulo').textContent = 'Editar proveedor';
    document.getElementById('prov-id').value        = p.id;
    document.getElementById('prov-rif').value       = p.rif;
    document.getElementById('prov-nombre').value    = p.nombre;
    document.getElementById('prov-contacto').value  = p.contacto || '';
    document.getElementById('prov-telefono').value  = p.telefono || '';
    document.getElementById('prov-email').value     = p.email || '';
    document.getElementById('prov-direccion').value = p.direccion || '';
    new bootstrap.Modal(document.getElementById('modalProveedor')).show();
}

async function guardar(e) {
    e.preventDefault();
    const id = document.getElementById('prov-id').value;
    const body = {
        rif:       document.getElementById('prov-rif').value,
        nombre:    document.getElementById('prov-nombre').value,
        contacto:  document.getElementById('prov-contacto').value,
        telefono:  document.getElementById('prov-telefono').value,
        email:     document.getElementById('prov-email').value,
        direccion: document.getElementById('prov-direccion').value
    };
    try {
        if (id) {
            await api.put(`/proveedores/${id}`, body);
            mostrarMensaje('Proveedor actualizado');
        } else {
            await api.post('/proveedores', body);
            mostrarMensaje('Proveedor creado');
        }
        bootstrap.Modal.getInstance(document.getElementById('modalProveedor')).hide();
        await cargar();
    } catch (err) {
        mostrarMensaje(err.message, 'danger');
    }
}

async function eliminar(id) {
    if (!confirm('¿Eliminar este proveedor?')) return;
    try {
        await api.delete(`/proveedores/${id}`);
        mostrarMensaje('Proveedor eliminado');
        await cargar();
    } catch (err) {
        mostrarMensaje(err.message, 'danger');
    }
}

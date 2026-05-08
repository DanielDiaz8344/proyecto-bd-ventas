// ============================================================================
// app.js - Navbar y footer compartidos en todas las páginas
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    const navbarSlot = document.getElementById('navbar-slot');
    const footerSlot = document.getElementById('footer-slot');

    if (navbarSlot) navbarSlot.innerHTML = navbarHTML();
    if (footerSlot) footerSlot.innerHTML = footerHTML();
});

function navbarHTML() {
    const base = window.location.pathname.includes('/pages/') ? '..' : '.';
    return `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
            <a class="navbar-brand" href="${base}/index.html">
                Sistema Administrativo
            </a>
            <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="nav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="${base}/pages/productos.html">Productos</a></li>
                    <li class="nav-item"><a class="nav-link" href="${base}/pages/categorias.html">Categorías</a></li>
                    <li class="nav-item"><a class="nav-link" href="${base}/pages/inventario.html">Inventario</a></li>
                    <li class="nav-item"><a class="nav-link" href="${base}/pages/almacenes.html">Almacenes</a></li>
                    <li class="nav-item"><a class="nav-link" href="${base}/pages/ventas.html">Ventas</a></li>
                    <li class="nav-item"><a class="nav-link" href="${base}/pages/clientes.html">Clientes</a></li>
                    <li class="nav-item"><a class="nav-link" href="${base}/pages/proveedores.html">Proveedores</a></li>
                </ul>
            </div>
        </div>
    </nav>`;
}

function footerHTML() {
    return `
    <footer>
        <div class="container">
            Proyecto BD Ventas - Programación I (UNETI) | Daniel Díaz | ${new Date().getFullYear()}
        </div>
    </footer>`;
}

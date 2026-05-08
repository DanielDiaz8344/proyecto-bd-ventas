// ============================================================================
// app.js - Sidebar profesional, footer y toggle responsive
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    const navbarSlot = document.getElementById('navbar-slot');
    const footerSlot = document.getElementById('footer-slot');

    if (navbarSlot) {
        navbarSlot.outerHTML = sidebarHTML() + toggleHTML();
        marcarActivo();
        document.querySelector('.sidebar-toggle')?.addEventListener('click', () => {
            document.querySelector('.app-sidebar')?.classList.toggle('show');
        });
    }

    if (footerSlot) footerSlot.outerHTML = footerHTML();
});

function sidebarHTML() {
    const base = window.location.pathname.includes('/pages/') ? '..' : '.';
    return `
    <aside class="app-sidebar">
        <div class="brand">
            <h1 class="brand-title">
                <span class="brand-logo">BV</span>
                BD Ventas
            </h1>
            <p class="brand-subtitle">Sistema Administrativo</p>
        </div>

        <nav>
            <div class="nav-section">General</div>
            <a class="nav-link" href="${base}/index.html" data-page="index">
                <i class="bi bi-grid-1x2"></i><span>Dashboard</span>
            </a>

            <div class="nav-section">Operaciones</div>
            <a class="nav-link" href="${base}/pages/nueva-venta.html" data-page="nueva-venta">
                <i class="bi bi-cart-plus"></i><span>Nueva venta</span>
            </a>
            <a class="nav-link" href="${base}/pages/ventas.html" data-page="ventas">
                <i class="bi bi-receipt"></i><span>Ventas</span>
            </a>
            <a class="nav-link" href="${base}/pages/inventario.html" data-page="inventario">
                <i class="bi bi-clipboard-data"></i><span>Inventario</span>
            </a>

            <div class="nav-section">Catálogo</div>
            <a class="nav-link" href="${base}/pages/productos.html" data-page="productos">
                <i class="bi bi-box-seam"></i><span>Productos</span>
            </a>
            <a class="nav-link" href="${base}/pages/categorias.html" data-page="categorias">
                <i class="bi bi-bookmark"></i><span>Categorías</span>
            </a>
            <a class="nav-link" href="${base}/pages/almacenes.html" data-page="almacenes">
                <i class="bi bi-building"></i><span>Almacenes</span>
            </a>

            <div class="nav-section">Contactos</div>
            <a class="nav-link" href="${base}/pages/clientes.html" data-page="clientes">
                <i class="bi bi-people"></i><span>Clientes</span>
            </a>
            <a class="nav-link" href="${base}/pages/proveedores.html" data-page="proveedores">
                <i class="bi bi-truck"></i><span>Proveedores</span>
            </a>
        </nav>

        <div class="sidebar-footer">
            <div>Daniel Díaz</div>
            <div style="opacity:0.6; margin-top:2px;">Programación I &middot; UNETI</div>
        </div>
    </aside>`;
}

function toggleHTML() {
    return `<button class="sidebar-toggle" aria-label="Menú"><i class="bi bi-list" style="font-size:1.2rem;"></i></button>`;
}

function footerHTML() {
    return `<footer class="app-footer">
        Proyecto BD Ventas &middot; Programación I (UNETI) &middot; ${new Date().getFullYear()}
    </footer>`;
}

function marcarActivo() {
    const path = window.location.pathname.toLowerCase();
    let pageKey;
    if (path.endsWith('/') || path.endsWith('/index.html')) pageKey = 'index';
    else {
        const last = path.split('/').pop().replace('.html', '');
        pageKey = last;
    }

    document.querySelectorAll('.app-sidebar .nav-link').forEach(link => {
        if (link.dataset.page === pageKey) link.classList.add('active');
    });
}

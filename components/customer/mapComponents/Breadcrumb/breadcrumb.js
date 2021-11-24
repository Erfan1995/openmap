
import styles from './breadcrumb.module.css'

const BreadCrumb = () => {
    return <div id={styles.crumbs}>
        <ul>
            <li><a href="#1"><i aria-hidden="true"></i>Habib</a></li>
            <li><a href="#2"><i aria-hidden="true"></i> Shop</a></li>
            <li><a href="#3"><i aria-hidden="true"></i> Cart</a></li>
        </ul>
    </div>
}

export default BreadCrumb;
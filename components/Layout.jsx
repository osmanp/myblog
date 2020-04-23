import Footer from "./Footer";
import Meta from "./Meta";
import Navbar from "./Navbar";

export default function Layout(props) {
  return (
    <>
      <section>
        <Meta
          siteTitle={props.siteTitle}
          siteDescription={props.siteDescription}
        />
        
      </section>

    <section>
      <Navbar siteTitle={props.siteTitle} onThemeChange={props.onThemeChange}/>{" "}
    </section>

      <section>
        
        {props.children}
        
      </section>

      <section>
        <Footer></Footer>
      </section>
    </>
  );
}

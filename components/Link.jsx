import React, { forwardRef } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import NextLink from "next/link";
import MuiLink from "@material-ui/core/Link";
import PropTypes from "prop-types";

const NextComposed = forwardRef(function NextComposed(props, ref) {
  const { href, as, prefetch, ...other } = props;
  return (
    <NextLink href={href} as={as} prefetch={prefetch}>
      <a ref={ref} {...other} />
    </NextLink>
  );
});

NextComposed.propTypes = {
  as: PropTypes.string,
  prefetch: PropTypes.func,
  props: PropTypes.object,
  href: PropTypes.string
};

const Link = ({
  href,
  className: classNameProps,
  activeClassName = "active",
  ...other
}) => {
  const router = useRouter();
  const pathname = typeof href === "string" ? href : href.pathname;
  const className = clsx(classNameProps, {
    [activeClassName]: router.pathname === pathname && activeClassName
  });

  return (
    <MuiLink
      component={NextComposed}
      className={className}      
      href={href}
      {...other}
    />
  );
};

Link.propTypes = {
  activeClassName: PropTypes.string,
  className: PropTypes.string,
  href: PropTypes.string
};

export default Link;

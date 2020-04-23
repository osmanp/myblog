import React, { Fragment } from 'react';
import Link from './Link';
import Header from './Header';
import blogposts from '../data/blog-posts';
import { Container, Box, Typography } from '@material-ui/core';
import Footer from './Footer';
const NextPost = ({ href, position, title }) => (
  <Link href={href}>
    {position}{' '}
    <Typography variant="h6" component="h6">
      {title}
    </Typography>
  </Link>
);
const BlogPost = ({ attributes, body, bodyBegin, frontMatter }) => {
    
    const current = blogposts.map(({ title }) => title).indexOf(meta.title);
    const next = blogposts[current - 1];
    const prev = blogposts[current + 1];
  
return (
    <Fragment>
      <Header />
      <Container maxWidth="md">
        <Box my={4}>
          <Link href="/">{'< '} BACK TO BLOG</Link>
        </Box>
        <Typography variant="h4" component="h1" gutterBottom>
          {meta.title}
        </Typography>
        {children}
        <hr />
        <Box my={4} display="flex" justifyContent="center">
          <Box mx={4}>
            {prev && (
              <NextPost
                href={prev.path}
                position="< Previous post"
                title={prev.title}
              />
            )}
          </Box>
          <Box mx={4}>
            {next && (
              <NextPost
                href={next.path}
                position="Next post >"
                title={next.title}
              />
            )}
          </Box>
        </Box>
      </Container>
      <Footer title="My Blog" description="Hi there, this is my blog!" />
    </Fragment>
  );
};
export default BlogPost;

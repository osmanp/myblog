import { Box, Card, Typography } from "@material-ui/core";
import Quotes from "../data/rumi_quotes";
import  styles from "../styles/quoteStyles.scss";

const Quote = () => { 
  const quoteIndex = Math.floor(Math.random() * 1000) % Quotes.length;
  const quote = Quotes[quoteIndex];
  return (
    <React.Fragment>
      <div className={styles.animatedShadowQuote}>
        <blockquote>
          <p>{quote}</p>
          <cite>Rumi</cite>
        </blockquote>
      </div>
      {/* <Card style={{ maxWidth: "100%", paddingLeft: "20px",backgroundColor:'#AACCCC'}}>
        <Box>
          <Typography variant="caption" >
            {"<<"}
          </Typography>
          <Typography variant="body1" component="body1" align="center">
            <em>{quote}</em>
          </Typography>
          <Typography variant="caption" >
            {">>"}
          </Typography>
          <Typography variant="subtitle2" align="right" style={{margin:'5px'}}>
            {"Rumi"}
          </Typography>
        </Box>
        </Card> */}
      {/* <div
        style={{ maxWidth: "100%", paddingLeft: "20px", boxShadow: " 1px 2px #283E4A" ,border: "1px solid" }}
      >
      
      </div> */}
    </React.Fragment>
  );
};

export default Quote;

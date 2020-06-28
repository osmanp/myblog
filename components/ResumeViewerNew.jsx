import {
  Chip,
  Container,
  Divider,
  Grid,
  Typography,
  Icon,
  SvgIcon,
  Paper,
  useTheme,
} from "@material-ui/core";
import React from "react";
import ReactPll from "react-pll";
import Resume from "../data/resume";
import {
  SqlServerIcon,
  NodeJSIcon,
  DebianIcon,
  WindowsIcon,
  PostgreSQLIcon,
  ReactIcon,
  RedisIcon,
  MongoDBIcon,
  DockerIcon,
  VSIcon,
  OracleIcon,
  GitIcon,
  ExpressIcon,
  NextJSIcon,
  JQueryIcon
} from "../data/svgIcons";

const getTechIcon = (type) => {
  switch (type) {
    case "SqlServer":
      return <SqlServerIcon></SqlServerIcon>;
    case "NodeJS":
      return <NodeJSIcon></NodeJSIcon>;
    case "Windows":
      return <WindowsIcon></WindowsIcon>;
    case "Debian":
      return <DebianIcon></DebianIcon>;
    case "Redis":
      return <RedisIcon></RedisIcon>;
    case "React":
      return <ReactIcon></ReactIcon>;
    case "PostgreSQL":
      return <PostgreSQLIcon></PostgreSQLIcon>;
    case "MongoDB":
      return <MongoDBIcon></MongoDBIcon>;
    case "Docker":
      return <DockerIcon></DockerIcon>;
    case "VS":
      return <VSIcon></VSIcon>;
    case "Oracle":
      return <OracleIcon></OracleIcon>;
      case "Git":
        return <GitIcon></GitIcon>;
        case "Express":
      return <ExpressIcon></ExpressIcon>;
      case "NextJS":
        return <NextJSIcon></NextJSIcon>;
        case "JQuery":
          return <JQueryIcon></JQueryIcon>;
    default:
      return <OracleIcon></OracleIcon>;
  }
};

const TechPart = ({ techs }) => {
  return (
    <>
      <Grid
        item
        container
        justify="flex-start"
        alignContent="flex-start"
        alignItems="stretch"
        spacing={1}
      >
        {techs.map((element, index) => {
          return (
            <div style={{ width: "30px", height: "40px", margin: "8px",marginLeft:'12px' }}>
              {getTechIcon(element)}
            </div>
          );
        })}
        <Typography style={{ minWidth: "100%" }}>
          <Divider variant="fullWidth"></Divider>
        </Typography>
      </Grid>
    </>
  );
};

const DatePart = ({ dates }) => {
  return (
    <>
      <Grid item container>
        <Typography
          style={{
            margin: "5px",
          }}
          variant="caption"
        >
          <em>{dates}</em>
        </Typography>
        <Typography style={{ minWidth: "100%" }}>
          <Divider variant="fullWidth"></Divider>
        </Typography>
      </Grid>{" "}
    </>
  );
};

const TitlePart = ({ title,company,dates }) => {
  return (
    <>
      <Grid item container alignContent="center">
        <Typography
          variant="h5"
          color="secondary"
          style={{
            margin: "2px",
            fontFamily: "Cambria",
          }}
        >
        <b>  {title + '  @   ' + company} </b>
         
        </Typography>
        <Typography
          style={{
            margin: "5px",
            fontFamily: "Cambria",
            fontSize:'1rem'
          }}
          variant="caption"
        >
          <em>({dates})</em>
        </Typography>
        <Typography style={{ minWidth: "100%" }}>
          <Divider variant="fullWidth"></Divider>
        </Typography>
      </Grid>{" "}
    </>
  );
};

const CompanyPart = ({ company }) => {
  return (
    <>
      <Grid item container>
        <Typography
          variant="subtitle1"
          style={{
            marginTop: "-10px",
          }}
        >
          {company}
        </Typography>
        <Typography style={{ minWidth: "100%" }}>
          <Divider variant="fullWidth"></Divider>
        </Typography>
      </Grid>
    </>
  );
};

const PLPart = ({ pl }) => {
  return (
    <>
      <Grid
        item
        container
        justify="flex-start"
        alignContent="center"
        alignItems="center"
        spacing={1}
      >
        {pl.map((element, index) => {
          return (
            <Grid item style={{marginLeft:'10px'}}>
              <ReactPll language={element} height={30} />
            </Grid>
          );
        })}       
      </Grid>
      <Grid item>
      <Typography style={{ minWidth: "100%" }}>
          <Divider variant="fullWidth"></Divider>
        </Typography>
      </Grid>
    </>
  );
};

const DescriptionPart = ({ description }) => {
  return (
    <>
      <Grid item>
        <ul>
          {description.map((element, index) => {
            return (
              <li key={index}>
                <Typography
                  variant="body2"
                  align="justify"
                  style={{
                    margin: "0.2rem",
                    paddingRight: "1.2rem",
                    paddingLeft: "0.1rem",
                    fontSize: "1rem",
                    fontWeight: 500,
                    fontFamily: "Cambria",
                  }}
                >
                  {element}
                </Typography>
              </li>
            );
          })}
        </ul>      
      </Grid>
    </>
  );
};

const TagsPart = ({ tags }) => {
  return (
    <>
    
      <Grid
        item
        container
        justify="flex-start"
        alignContent="flex-start"
        alignItems="center"
        spacing={1}        
      >
        
        {tags.map((element, index) => {
          return (
            <Grid item>
              <Chip
                label={element}
                variant="outlined"
                color="secondary"
                size="small"
                style={{ fontFamily: "Trebuchet MS" }}
              ></Chip>
            </Grid>
          );
        })}
        
        <Typography style={{ minWidth: "100%" }}>
          <Divider variant="fullWidth"></Divider>
        </Typography>
      </Grid>          
    </>
  );
};

const ResumeItem = ({
  title,
  dates,
  description,
  tags,
  company,
  pl,
  techs,
}) => {
  const theme = useTheme();
  return (
    <div>
      <Paper elevation={10} style={{textAlign:'left',padding:'10px',margin:'-10px',backgroundColor:theme.palette.background.paper}}>
      <Grid
        container
        item
        direction="column"
        spacing={2}
        
      >
        <TitlePart title={title} company={company} dates={dates}></TitlePart>
        {/* <CompanyPart company={company}></CompanyPart> */}

        {/* <DatePart dates={dates}></DatePart> */}
        <PLPart pl={pl}></PLPart>
        <TechPart techs={techs}></TechPart>
        <TagsPart tags={tags}></TagsPart>
        <DescriptionPart description={description}></DescriptionPart>        
      </Grid>
      </Paper>
      
    </div>
  );
};
const ResumeViewer = () => {
  return (
    <Container maxWidth="lg" style={{ marginBottom: "20px" }}>
      <Grid container spacing={7}>
        {Resume.map((x, index) => {
          return (
            <Grid item key={index}>
              <ResumeItem
                title={x.Title}
                description={x.Description}
                dates={x.Dates}
                tags={x.Tags}
                company={x.Company}
                pl={x.PL}
                techs={x.Tech}
              ></ResumeItem>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default ResumeViewer;

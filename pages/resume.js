import { Container, CssBaseline, Grid, Typography, Divider, Box, Paper, List, ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import React from "react";
import Rating from '@material-ui/lab/Rating';
import { withStyles } from '@material-ui/core/styles';
import ResumeViewer from "../components/ResumeViewerNew";
import styles from "../styles/links.scss";
import FolderIcon from '@material-ui/icons/Folder';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import CropDinIcon from '@material-ui/icons/CropDin';

import BatteryCharging20Icon from '@material-ui/icons/BatteryCharging20';
import BatteryCharging30Icon from '@material-ui/icons/BatteryCharging30';
import BatteryCharging50Icon from '@material-ui/icons/BatteryCharging50';
import BatteryCharging60Icon from '@material-ui/icons/BatteryCharging60';
import BatteryCharging80Icon from '@material-ui/icons/BatteryCharging80';
import BatteryCharging90Icon from '@material-ui/icons/BatteryCharging90';
import BatteryChargingFullIcon from '@material-ui/icons/BatteryChargingFull';
import CropSquareIcon from '@material-ui/icons/CropSquare';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import Filter1Icon from '@material-ui/icons/Filter1';

const fontSize = "6px";
const customIcons = {
    1: {
        icon: <FiberManualRecordIcon fontSize={fontSize} />,
        label: 'Very Dissatisfied',
    },
    2: {
        icon: <FiberManualRecordIcon fontSize={fontSize} />,
        label: 'Dissatisfied',
    },
    3: {
        icon: <FiberManualRecordIcon fontSize={fontSize} />,
        label: 'Neutral',
    },
    4: {
        icon: <FiberManualRecordIcon fontSize={fontSize} />,
        label: 'Satisfied',
    },
    5: {
        icon: <FiberManualRecordIcon fontSize={fontSize} />,
        label: '100',
    },
};

const IconContainer = (props) => {
    const { value, ...other } = props;
    return (<div {...other} >{customIcons[value].icon}</div>);
}

const skillItem = (text, value) => {
    return (
        <Grid item container direction="row" alignItems="stretch" spacing={1} justify="space-between" alignContent="stretch">
            <Grid item xs={8}>
                <Typography
                    color='primary'
                    noWrap
                    variant="h6"
                    style={{
                        fontSize: "1.1rem",
                        fontFamily: "Cambria",
                    }}
                >
                    <u>{text}</u>
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <Box style={{ minWidth: '70%', marginLeft: '10px' }}>
                    <StyledRating
                        name="customized-empty"
                        defaultValue={value}
                        IconContainerComponent={IconContainer}
                    />
                </Box>

            </Grid>

        </Grid>
    )
}

const linkItem = (text, src) => (
    <>
        <a href={src} className={styles.link}>
            {text}
        </a>
    </>
);

const listItemHeader = (text) => {
    return (
        <ListItem>
            <Typography
                color='primary'
                variant="h6"
                style={{
                    fontFamily: "Cambria",
                    marginLeft: "-20px"
                }}
            >
                <u><b>{text}</b></u>
            </Typography>
        </ListItem>
    )
}

const listItemValue = (text) => {
    return (
        <ListItem>
            <Typography
                color='primary'
                variant="h6"
                style={{
                    fontFamily: "Cambria",
                    marginLeft: "-20px"
                }}
            >
                {text}
            </Typography>
        </ListItem>
    )
}

const certItem = (title, course) => {
    return (
        <Grid item container direction="column" alignItems="flex-start" justify="flex-start" alignContent='flex-start'>
            <Grid item>
                <Typography
                    color='primary'
                    variant="h6"
                    component="h6"
                    style={{
                        fontFamily: "Cambria",
                        marginTop: '5px',
                    }}
                >
                    <b>{title}</b>
                </Typography>
            </Grid>
            <Grid item>
                <Typography
                    color='primary'
                    variant="h6"
                    component="h6"
                    style={{
                        fontFamily: "Cambria",
                        marginTop: '5px',
                        fontSize:'1rem'
                    }}
                >
                    <i> {course}</i>
                </Typography>
            </Grid>
        </Grid>
    )
}
const refItem = (person, title, mail, gsm) => {
    return (
        <Grid item container direction="column" alignItems="flex-start" justify="flex-start" alignContent='flex-start'>
            <Grid item>
                <Typography
                    color='primary'
                    variant="h6"
                    component="h6"
                    style={{
                        fontFamily: "Cambria",
                        marginTop: '5px'
                    }}
                >
                    <u><b>{person}</b></u>
                </Typography>
            </Grid>
            <Grid item>
                <Typography
                    color='secondary'
                    variant="h6"
                    component="h6"
                    style={{
                        fontFamily: "Cambria",
                        marginTop: '5px'
                    }}
                >
                    <u> {title}</u>
                </Typography>
            </Grid>
            <Grid item>
                <Typography
                    color='primary'
                    variant="h6"
                    component="h6"
                    style={{
                        fontFamily: "Cambria",
                        marginTop: '5px'
                    }}
                >
                    <b><i> mail: {mail}</i></b>
                </Typography>
            </Grid>
            <Grid item>
                <Typography
                    color='primary'
                    variant="h5"
                    component="h5"
                    style={{
                        fontFamily: "cambri",
                        marginTop: '5px'
                    }}
                >
                    <b><i> gsm: {gsm}</i></b>
                </Typography>
            </Grid>
        </Grid>
    )
}
const divisionStart = (header) => {
    return (
        <Grid item container alignItems="flex-start" justify="flex-start" style={{ borderBottom: "1px solid" }}>
            <Grid item>
                <Typography
                    color='primary'
                    variant="h5"
                    component="h5"
                    style={{
                        fontFamily: "Cambria",
                        marginTop: "25px",
                        fontWeight: 200,
                    }}
                >
                    <b>
                        {header}
                    </b>
                </Typography>
            </Grid>
        </Grid>
    )
}

const divisionStartHalf = (header) => {
    return (
        <Grid item xs={12} container alignItems="flex-start" justify="flex-start" style={{ borderBottom: "1px solid" }}>
            <Grid item>
                <Typography
                    color='primary'
                    variant="h5"
                    component="h5"
                    style={{
                        fontFamily: "Helvetica",
                        marginTop: "25px",
                        fontWeight: 200,
                    }}
                >
                    <b>
                        {header}
                    </b>
                </Typography>
            </Grid>
        </Grid>
    )
}
const StyledRating = withStyles({
    iconFilled: {
        color: '#1E90FF',
    },
    iconEmpty: {
        color: 'lightgray',
    },
    iconHover: {
        color: '#ff3d47',
    },
})(Rating);

const About = (props) => {
    return (
        <React.Fragment>
            <CssBaseline />
            <Container
                maxWidth="lg"
                style={{ padding:'20px', marginBottom: "10px", marginTop: "20px", backgroundColor: "white" }}
            >
                <Grid
                    container
                    spacing={1}
                    direction="column"
                    alignItems="center"
                    justify="center"
                >
                    <Grid item container direction="row">
                        <Paper elevation={4} style={{ minWidth: '20%' }}>
                            <img src="/photos/me.png" style={{ minWidth: '100%' }}></img>
                        </Paper>
                        <Grid item>
                            <Typography
                                className={styles.linky}
                                color='primary'
                                variant="h3"
                                component="h4"
                                style={{
                                    fontFamily: "Consolas,Helvetica,Arial,sans-serif",
                                    marginTop: "50px",
                                    marginLeft: "50px",
                                }}
                            >
                                Osman Paşalak
                </Typography>

                        </Grid>

                    </Grid>

                    <Grid
                        item
                        container
                        spacing={4}
                        direction="row"
                        alignItems="stretch"
                        justify="space-between"
                    >

                        <Grid item xs={6}>
                            {divisionStartHalf("Summary")}
                            <Typography
                                variant="h5"
                                component="h5"
                                align='justify'
                                style={{
                                    fontFamily: "Cambria",
                                    fontSize: '1.3rem'
                                }}>
                                A tech lover and senior software engineer with 10+ years of experience on analyzing, designing, developing and testing various projects. I got my BS degree in Computer Science from
                                METU(Middle East Technical University) at 2008.
                                As a lifelong learner, I worked with different tech stacks, databases, frameworks, OS and programming languages. Proficient in solving complex problems and optimizations,
                                asynchronous and multithread programming, API design, SQL and data analysis, scaling applications, working on high-dimensional and large data.
                                Also worked with many standard and protocols like TCP/UDP, HTTP, REST, AMQP, WebSockets, OAuth.
                        </Typography>
                        </Grid>

                        <Grid item xs={5}>
                            {divisionStartHalf("Contact & Info")}
                            <Grid item xs={12} container direction="row" alignItems="flex-start" justify="flex-start" alignContent='flex-start' >
                                <Grid item xs={3} >
                                    <List>
                                        {listItemHeader("Birth Date")}
                                        {listItemHeader("Mail")}
                                        {listItemHeader("GSM")}
                                        {listItemHeader("Address")}
                                    </List>
                                </Grid>
                                <Grid item xs={8}>
                                    <List>
                                        {listItemValue("15 Sept. 1985")}
                                        {listItemValue("osmanpasalak@gmail.com")}
                                        {listItemValue("+90 533 465 0408")}
                                        {listItemValue("Üsküdar/İstanbul, Turkey")}
                                    </List>
                                </Grid>
                            </Grid>
                        </Grid>

                    </Grid>


                    {divisionStart("Skills")}

                    <Grid
                        item
                        container
                        spacing={1}
                        direction="row"
                        alignItems="stretch"
                        justify="space-between"
                        alignContent="stretch"
                    >

                        <Grid
                            item
                            xs={4}
                            container
                            direction="column"
                            alignItems="stretch"
                            justify="space-evenly"
                        >
                            <Grid item container>{skillItem("Javascript (incl. Typescript)", 5)}</Grid>
                            <Grid item container>{skillItem("C#", 5)}</Grid>
                            <Grid item container>{skillItem("C, C++", 4)}</Grid>
                            <Grid item container>{skillItem("SQL(PostgreSQL, MS SQL)", 5)}</Grid>
                            <Grid item container>{skillItem("NoSQL(MongoDB, RethinkDB)", 4)}</Grid>
                            <Grid item container>{skillItem("Python", 3)}</Grid>
                            <Grid item container>{skillItem("Java", 2)}</Grid>
                        </Grid>
                        <Grid
                            item
                            xs={4}
                            container
                            direction="column"
                            alignItems="stretch"
                            justify="space-evenly"
                        >
                            <Grid item container>{skillItem("NodeJS", 5)}</Grid>
                            <Grid item container>{skillItem("RabbitMQ", 5)}</Grid>
                            <Grid item container>{skillItem("React", 3)}</Grid>
                            <Grid item container>{skillItem("CSS", 3)}</Grid>
                            <Grid item container>{skillItem("Html", 4)}</Grid>
                            <Grid item container>{skillItem("Redis", 4)}</Grid>
                            <Grid item container>{skillItem("Docker, Kubernetes", 3)}</Grid>
                            <Grid item container>{skillItem("GraphQL", 3)}</Grid>
                        </Grid>
                        <Grid
                            item
                            xs={4}
                            container
                            direction="column"
                            alignItems="stretch"
                            justify="space-evenly"
                        >
                            <Grid item container>{skillItem("Architectural & Design Patterns", 5)}</Grid>
                            <Grid item container>{skillItem("Agile Software Development", 5)}</Grid>
                            <Grid item container>{skillItem("Domain-driven Design", 5)}</Grid>
                            <Grid item container>{skillItem("CI/CD & versioning", 4)}</Grid>
                            <Grid item container>{skillItem("Test-driven Development", 4)}</Grid>
                            <Grid item container>{skillItem("Cloud Services(AWS,GCloud,Azure)", 2)}</Grid>
                            <Grid item container>{skillItem("Documentation & Modeling", 5)}</Grid>
                        </Grid>
                    </Grid>


                    {divisionStart("Experience")}
                    <Grid item container alignItems="flex-start" justify="flex-start" style={{ marginTop: '20px' }}>
                        <Grid item>
                            <ResumeViewer></ResumeViewer>
                        </Grid>
                    </Grid>

                    <Grid
                        item
                        container
                        spacing={4}
                        direction="column"
                        alignItems="stretch"
                        justify="space-between"
                    >
                        <Grid item xs={12} container direction="row" alignItems="flex-start" justify="flex-start" alignContent='flex-start'>

                            {divisionStartHalf("Education")}
                            <Grid item container direction="column" alignItems="flex-start" justify="flex-start" alignContent='flex-start'>
                                <Grid item container direction="column" alignItems="flex-start" justify="flex-start" alignContent='flex-start'>
                                    <Grid item>
                                        <Typography
                                            color='primary'
                                            variant="h5"
                                            component="h5"
                                            style={{
                                                fontFamily: "Cambria",
                                                marginTop: '5px',                                                
                                            }}
                                        >
                                            <b>Bachelor Degree of Computer Science</b> , <i> Middle East Technical University, 2003 - 2008</i>
                                        </Typography>
                                    </Grid>

                                </Grid>
                                <Grid item container direction="column" alignItems="flex-start" justify="flex-start" alignContent='flex-start'>
                                    <Grid item>
                                        <Typography
                                            color='primary'
                                            variant="h5"
                                            component="h5"
                                            style={{
                                                fontFamily: "Cambria",
                                                marginTop: '5px'
                                            }}
                                        >
                                            <b>High School</b> , <i>Konya Science High School, 2000 - 2003</i>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} container direction="row" alignItems="flex-start" justify="flex-start" alignContent='flex-start'>
                            {divisionStartHalf("Languages")}
                            <Grid item xs={12}><Typography
                                color='primary'
                                variant="h5"
                                component="h5"
                                style={{
                                    fontFamily: "Cambria",
                                    marginTop: '5px',
                                    fontSize:'1.3rem'
                                }}
                            >
                                Turkish(Native), English(Advanced),  German(Beginner), Italian(Beginner)
                    </Typography></Grid>

                        </Grid>
                        <Grid item xs={12} container direction="row" alignItems="flex-start" justify="flex-start" alignContent='flex-start'>
                            {divisionStartHalf("Certificates")}
                            <Grid item container direction="column" alignItems="flex-start" justify="flex-start" alignContent='flex-start'>
                                {certItem("Tuning and tips for high performance usage of SQL Server, IIS and ASP.net", "BT-Akademi, 04/2015")}
                                {certItem("Enterprise Design Patterns & Architectures (Kurumsal Yazılım Mimarileri)", "BT-Akademi, 03/2015")}
                                {certItem("Introduction to programming ArcObjects", "ArcGIS, 09/2008")}
                                {certItem("Building Geodatabase", "ArcGIS, 09/2008")}
                            </Grid>
                        </Grid>
                        <Grid item xs={12} container direction="row" alignItems="flex-start" justify="flex-start" alignContent='flex-start'>


                            {divisionStartHalf("Hobbies")}

                            <Grid item xs={12}>
                                <Typography
                                    color='primary'
                                    variant="h6"
                                    component="h6"
                                    style={{
                                        fontFamily: "consolas",
                                        marginTop: '5px'
                                    }}
                                >
                                    <i>Traveling and walking around, Playing old games,
    Trying to write a novel, Home gardening, Cooking</i>
                                </Typography>

                            </Grid>
                        </Grid>
                        <Grid item xs={12} container direction="row" alignItems="flex-start" justify="flex-start" alignContent='flex-start'>


                            {divisionStart("References")}
                            <Grid item container direction="column" alignItems="flex-start" justify="flex-start" alignContent='flex-start' spacing={5}>
                                {refItem("Serhat Alyurt", "Product Manager and Chief of Engineering Department. at Armakom Tech", "serhat.alyurt@armongate.com", "+90 530 340 99 59")}
                                {refItem("Ali İzzet Tanrıöver", "Software Team Leader at Doğuş Tech.", "izzett@d-teknoloji.com.tr", "+90 530 954 47 28")}
                            </Grid>
                        </Grid>

                    </Grid>
                </Grid>
            </Container>
        </React.Fragment>
    );
};
export default About;

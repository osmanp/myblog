import React from "react";
import {Typography} from '@material-ui/core';
import _ from 'lodash';

const H1Style = ({level, text}) => {
  return (
    <Typography variant='h2'>{text} </Typography>
  )
}
const H2Style = ({level, text}) => {  
  return (
    <Typography variant='h4' style={{marginTop:'20px', marginBottom:'20px'}}>{text}</Typography>
  )
}
const H3Style = ({level, text}) => {
  return (
    <Typography variant='h5' style={{marginTop:'10px', marginBottom:'10px'}}><u>{"    " +text}</u> </Typography>
  )
}
const H4Style = ({level, text}) => {
  return (
    <Typography variant='h5'>{text} </Typography>
  )
}
const H5Style = ({level, text}) => {
  return (
    <Typography variant='h6'>{text} </Typography>
  )
}
const H6Style = ({level, text}) => {
  return (
    <Typography variant='caption'>{text} </Typography>
  )
}

var styleConverter = _.cond([
  [_.matchesProperty('level',1), H1Style],
  [_.matchesProperty('level',2), H2Style],
  [_.matchesProperty('level',3), H3Style],
  [_.matchesProperty('level',4), H4Style],
  [_.matchesProperty('level',5), H5Style],
  [_.matchesProperty('level',6), H6Style],
]);

const HeadingRenderer = (props) => {
  let childNode = props.children[0].props;
  let level = props.level;
  //console.log(props.children[0].props);
  return (
    <>
    {styleConverter({level:level,text:childNode.value})}
    </>
  )
};

export default HeadingRenderer;

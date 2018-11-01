import React, { Component} from 'react'
export default function itemRender(current, type, originalElement) {
  // console.log(current, type, originalElement)
    if (type === 'prev') {
      return <a className='btn' style={{marginRight:10}}>上一页</a>;
    } if (type === 'next') {
      return <a className='btn' style={{marginLeft:10}}>下一页</a>;
    }
    return originalElement;
  }
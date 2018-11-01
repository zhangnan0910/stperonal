import React, { Component } from 'react'
import {
    Table,
    Pagination
} from 'antd'
export default class AddData extends Component {
    constructor(){
        super()
        this.state = {
            val : []
        }
    }
    // 分组check 表格
    const
    rowSelection = {
        type:'radio',
        onChange: (selectedRowKeys, selectedRows) => {
            this.setState({
                val : selectedRows
            })
        }
    }
    handleTableChange = (cur, pageSize) => {
        this.getData( cur, pageSize)
    }
    render() {
        let { data, onChange } = this.props
        return (
            <div>
                <Table
                    columns={data.columns}
                    dataSource={data.dataSource}
                    rowSelection={this.rowSelection}
                    pagination={false}
                    locale = {
                        {emptyText:'暂无数据'}
                      }
                // rowKey={record => record.teacherId ? record.teacherId : record.studentId}
                />
                <Pagination
                    style={{ textAlign: "center", paddingTop: 10 }}
                    total={data.total}
                    pageSize={data.pageSize}
                    itemRender={data.itemRender}
                    
                    defaultCurrent={data.defaultCurrent}
                    onChange={onChange} />
            </div>
        )
    }
}
<AddData
    onChange={this.handleTableChange}
    valchild={this.valchild}
    data={{
        columns:columns,
        dataSource:data,
        pagination:false,
        total:+this.state.total,
        pageSize:this.state.perpage,
        itemRender:itemRender,
        defaultCurrent:this.state.page,
}}></AddData>
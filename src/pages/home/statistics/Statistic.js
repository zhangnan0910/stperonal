import React from 'react';
import './style.less';
import http from '@/utils/http';

class Statistics extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            schoolHome: '',
        }
    }

    componentDidMount() {
        this.fetchSchoolHome();
    }


    fetchSchoolHome = async () => {
        await http.post("/course/school-home", {}).then((response) => {
            if (response.error_info.errno === 1) {
                this.setState({
                    schoolHome: response.data
                })
            }
        });

    }


    render() {
        const {schoolHome} = this.state;
        return (
            <div style={{padding: 20}}>
                <div className="index">
                    <div className="ongoing">
                        <div className="mark">进行中的课程</div>
                        <div className="course">
                            <div className="item">
                                <img
                                    style={{width: 40, height: "auto", margin: 15}}
                                    src={require("@/assets/imgs/icons/icon_main_book_white.png")}
                                    alt=""/>
                            </div>
                            <div className="item">
                                <div className="count">{schoolHome && schoolHome.course_num}</div>
                                <div className="bar">课程数</div>
                            </div>
                            <div className="item">
                                <div className="word">{schoolHome && schoolHome.class_num}</div>
                                <div className="bar">课节数</div>
                            </div>
                        </div>
                    </div>
                    <div className="studentShow">
                        <div className="mark">学生数</div>
                        <div className="course">
                            <div className="item">
                                <img
                                    style={{width: 40, height: "auto", margin: 15}}
                                    src={require("@/assets/imgs/icons/icon_main_students.png")}
                                    alt=""/>
                            </div>
                            <div className="item">
                                <div className="count">{schoolHome && schoolHome.student_num}</div>
                                <div className="bar">机构总学生数</div>
                            </div>
                            <div className="item">
                                <div className="word">人</div>
                            </div>
                        </div>
                    </div>
                    <div className="teacherShow">
                        <div className="mark">教师数</div>
                        <div className="course">
                            <div className="item">
                                <img
                                    style={{width: 40, height: "auto", margin: 15}}
                                    src={require("@/assets/imgs/icons/icon_main_teacher.png")}
                                    alt=""/>
                            </div>
                            <div className="item">
                                <div className="count">{schoolHome && schoolHome.teacher_num}</div>
                                <div className="bar">机构总教师数</div>
                            </div>
                            <div className="item">
                                <div className="word">人</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Statistics;
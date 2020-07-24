import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Button,
  Tabs,
  Menu,
  Dropdown,
  Icon,
  Divider,
  Tooltip,
  ConfigProvider,
  Form,
  Row,
  Col,
  message,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import { findFullscreen, isFullscreen, requestFullscreen, exitFullscreen } from '@/utils/fullscreen';
import { order, status } from '@/utils/columns';
import { nameInput, statusSelect, numberInputNumber, dateDatePicker } from '@/utils/formItem';
import styles from './index.less';

const rootRef = React.createRef();
const FormItem = Form.Item;
const { TabPane } = Tabs;
const ButtonGroup = Button.Group;


@connect(({ mockAsset , loading }) => {
  return ({
    ...mockAsset,
    loading: loading.effects['mockAsset/fetch'],
  });
})

@Form.create()

// ROUTE_PATH
// BLOCK_NAME
// PAGE_NAME
// PAGE_NAME_UPPER_CAMEL_CASE
// BLOCK_NAME_CAMEL_CASE

class Page extends PureComponent {

  columns = [
    {
      title: '序号',
      align: 'center',
      width: 80,
      render: (text, record, index) => order(index + 1),
    },
    {
      title: '任务状态',
      align: 'center',
      dataIndex: 'status',
      width: 110,
      render: num => status(num),
      sorter: true,
    },
    {
      title: '申请机构',
      dataIndex: 'title',
      width: 120,
      ellipsis: true,
    },
    {
      title: '申请用户',
      dataIndex: 'name',
      width: 120,
      ellipsis: true,
    },
    {
      title: '申请日期',
      dataIndex: 'createdAt',
      width: 200,
      ellipsis: true,
    },
    {
      title: '更新日期',
      dataIndex: 'updatedAt',
      width: 200,
      ellipsis: true,
    },
    {
      title: '备注',
      width: 120,
      ellipsis: true,
      dataIndex: 'remark',
    },
  ];

  state = {
    selectedRows: [],
    tableSize: 'default',
    isFullScreen: false,
    formValues: {},
    expandForm: false,
    ifRenderForm: true,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'mockAsset/fetch',
    });

    window.onresize = () => { // 监听页面全屏事件
      this.setState({ isFullScreen: isFullscreen() })
    };
  }

  handleTabs = key => {
    console.log(key);
  };

  handleMenuClick = e => {
    console.log('click', e);
  };


  handleFullScreen = () => {
    const { isFullScreen } = this.state;
    if (!isFullScreen && findFullscreen()) {
      requestFullscreen(rootRef.current)
    } else  {
      exitFullscreen()
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };


  handleStandardTableChange = (pagination, filters, sorter) => {
    const { dispatch } = this.props;

    const params = {
      page: pagination.current,
      limit: pagination.pageSize,
    };

    if (sorter.order) {
      params.sorter = `${sorter.columnKey}_${sorter.order}`
    }

    dispatch({
      type: 'mockAsset/fetch',
      payload: params,
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, values) => {
      if (err) return;
      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'mockAsset/fetch',
        payload: values,
      });
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'mockAsset/fetch',
      payload: {},
    });
  };

  handleRefresh = () => {
    const { dispatch } = this.props;
    const { formValues } = this.state
    dispatch({
      type: 'mockAsset/fetch',
      payload: formValues,
    });
  }

  toggleForm = () => { // 展开、收起
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSubmit} layout="inline">
        <Row gutter={[{ md: 8, lg: 24, xl: 48 }, 24]}>
          <Col md={8} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator('name')(nameInput)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(statusSelect)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSubmit} layout="inline">
        <Row gutter={[{ md: 8, lg: 24, xl: 48 }, 24]}>
          <Col md={8} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator('name')(nameInput)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(statusSelect)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="调用次数">
              {getFieldDecorator('number')(numberInputNumber)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={[{ md: 8, lg: 24, xl: 48 }, 24]}>
          <Col md={8} sm={24}>
            <FormItem label="更新日期">
              {getFieldDecorator('date')(dateDatePicker)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status3')(statusSelect)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }


  render() {
    const {
      loading,
      tableData = { records: [] },
    } = this.props;
    const { selectedRows, tableSize, isFullScreen, ifRenderForm, expandForm } = this.state;
    const EditMenu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="1"><Icon type="edit"/> 删除</Menu.Item>
        <Menu.Item key="2"><Icon type="delete"/> 修改</Menu.Item>
      </Menu>
    );
    const ColumnHeightMenu = (
      <Menu onClick={e => { this.setState({ tableSize: e.key }) }} selectedKeys={tableSize}>
        <Menu.Item key="default">默认</Menu.Item>
        <Menu.Item key="middle">中等</Menu.Item>
        <Menu.Item key="small">紧凑</Menu.Item>
      </Menu>
    );

    return (
      <div className={styles.Page} ref={rootRef}>
        <ConfigProvider getPopupContainer={() => rootRef.current}>
          <Tabs defaultActiveKey="1" onChange={this.handleTabs} tabBarStyle={{ background: '#fff' }}>
            <TabPane tab="PAGE_NAME" key="1">
              {
                ifRenderForm ? (
                  <Card bordered={false} style={{ marginBottom: 24 }} bodyStyle={{paddingBottom: 12}}>
                    {this.renderForm()}
                  </Card>
                ) : undefined
              }
              <Card bordered={false} bodyStyle={{paddingBottom: 0}}>
                <Row>
                  <Col xl={12} sm={24}>
                    <div className={styles.buttonLeft}>
                      <Button type="primary" icon="plus">新建</Button>
                      <ButtonGroup>
                        <Button disabled>提交</Button>
                        <Button disabled>打印</Button>
                        <Button disabled>导出</Button>
                      </ButtonGroup>
                    </div>
                  </Col>
                  <Col xl={12} sm={24}>
                    <div className={styles.buttonRight}>
                      <Button icon="appstore" onClick={() => this.setState({ifRenderForm: !ifRenderForm})}>字段检索</Button>
                      <Dropdown overlay={EditMenu}>
                        <Button>
                          编辑 <Icon type="down"/>
                        </Button>
                      </Dropdown>
                      <Divider type="vertical"/>
                      <Tooltip title='密度'>
                        <Dropdown overlay={ColumnHeightMenu} trigger={['click']}>
                          <Button type="link" icon="column-height"/>
                        </Dropdown>
                      </Tooltip>
                      <Tooltip title='列设置'>
                        <Button type="link" icon="setting" onClick={() => {message.warning('暂未开放..')}}/>
                      </Tooltip>
                      <Tooltip title={isFullScreen ? '退出全屏模式' : '全屏模式'}>
                        <Button type="link" icon={isFullScreen ? 'fullscreen-exit' : 'fullscreen'} onClick={this.handleFullScreen}/>
                      </Tooltip>
                      <Tooltip title='刷新'>
                        <Button type="link" icon="reload" onClick={() => this.handleRefresh()} />
                      </Tooltip>
                    </div>
                  </Col>
                </Row>

                {/* eslint-disable-next-line no-nested-ternary */}
                <div className={ifRenderForm ? expandForm ? styles.tableHeight2 : styles.tableHeight1 : styles.tableHeight3}>
                  <StandardTable
                    loading={loading}
                    tableData={tableData}
                    columns={this.columns}
                    onChange={this.handleStandardTableChange}
                    alertNum={{ amount: 100, count: 10 }}
                    selectedRows={selectedRows}
                    onSelectRow={this.handleSelectRows}
                    size={tableSize}
                  />
                </div>
              </Card>
            </TabPane>
            <TabPane tab="PAGE_NAME2" key="2">
              Content of Tab Pane 2
            </TabPane>
          </Tabs>
        </ConfigProvider>
      </div>
    );
  }
}

export default Page;

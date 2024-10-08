/**
 * @author Destin
 * @description 项目管理
 * @date 2023/10/07
 */

import ProjectApi from "@/apis/projectApi";
import { FPage } from "@/components";
import { IProjectModel } from "@/models/projectModel";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Space, Typography } from "antd";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import ProjectDrawer from "./projectDrawer";

const ProjectPage = () => {
  const actionRef = useRef<ActionType>();
  // const tabRef = useRef("0");
  const navitate = useNavigate();
  const columns: ProColumns<IProjectModel>[] = [
    {
      title: "项目编号",
      dataIndex: "projectManager",
      search: false,
    },
    {
      title: "项目名称",
      dataIndex: "projectName",
    },
    {
      title: "状态",
      dataIndex: "auditsStatus",
      valueType: "select",
      search: false,
      valueEnum: {
        0: { text: "成本核算", status: "Default" },
        1: { text: "草稿", status: "Default" },
        2: { text: "待算量", status: "Warning" },
        3: { text: "待审核", status: "Warning" },
        4: { text: "待回复", status: "Warning" },
        5: { text: "审核提交", status: "Warning" },
        6: { text: "通过", status: "Success" },
      },
    },
    {
      title: "主合同名称",
      dataIndex: "contractName",
      search: false,
    },
    {
      title: "合同收入(万元)",
      dataIndex: "contractIncome",
      search: false,
    },
    {
      title: "目标成本(万元)",
      dataIndex: "targetCost",
      search: false,
    },
    {
      title: "实际成本",
      dataIndex: "actualCost",
      search: false,
    },
    {
      title: "项目经理",
      dataIndex: "projectManage",
      search: false,
    },
    {
      title: "操作",
      width: "auto",
      fixed: "right",
      align: "center",
      search: false,
      render: (_, val) => {
        return (
          <Space>
            <Typography.Link
              onClick={() => {
                navitate(`/project-manage/project/detail?id=${val.id}`);
              }}
            >
              详情
            </Typography.Link>
            {/* <Popconfirm
              title="确认删除此项目？"
              onConfirm={() => {
                return ProjectApi.delete(val.id).then(() => {
                  actionRef.current?.reload();
                  message.success("操作成功");
                });
              }}
            >
              <Typography.Link type="danger">删除</Typography.Link>
            </Popconfirm> */}
          </Space>
        );
      },
    },
  ];

  return (
    <FPage>
      <ProTable
        actionRef={actionRef}
        scroll={{ x: "max-content" }}
        rowKey={"id"}
        request={async ({ current: pageNum, pageSize, ...val }) => {
          const res = await ProjectApi.getList({
            pageNum,
            pageSize,
            ...val,
            // queryStatus: Number(tabRef.current),
          });
          return {
            data: res.data || [],
            success: true,
            total: res.totalRow,
          };
        }}
        bordered
        columns={columns}
        toolbar={{
          actions: [
            <ProjectDrawer
              onCreate={() => {
                actionRef.current?.reload();
              }}
            />,
          ],
          // menu: {
          //   type: "tab",
          //   defaultActiveKey: tabRef.current,
          //   onChange(e) {
          //     tabRef.current = e as string;
          //     actionRef.current?.reload();
          //   },
          //   items: [
          //     {
          //       label: "全部项目",
          //       key: "0",
          //     },
          //     {
          //       label: "待审核项目",
          //       key: "1",
          //     },
          //     {
          //       label: "审核中项目",
          //       key: "2",
          //     },
          //     {
          //       label: "审核通过项目",
          //       key: "3",
          //     },
          //   ],
          // },
          multipleLine: true,
        }}
      />
    </FPage>
  );
};

export default ProjectPage;

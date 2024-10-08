/**
 * @author Destin
 * @description 项目成本差费-专业分包工程费
 * @date 2023/12/25
 */

import { ContractImportApi } from "@/apis/projectApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Space, Typography } from "antd";
import { useContext, useRef, useState } from "react";
import AmountView from "../components/AmountView";
import { ProjectContext } from "../detailContext";
import ChildTable from "./childTable";
import MatchModal, { IMatchModalRef } from "./modal/matchModal";

const ProjectCost = () => {
  const actionRef = useRef<ActionType>();
  const { projectId, projectInfo } = useContext(ProjectContext);
  const [reloadNum, setReloadNum] = useState(0);
  const [tabKey, settabKey] = useState("1");
  const modalRef = useRef<IMatchModalRef>(null);
  const [selectKeys, setSelectKeys] = useState<string[]>();
  const columns: ProColumns[] = [
    {
      title: "项目名称",
      dataIndex: "name",
    },
    {
      title: "局清单编码",
      dataIndex: "groupBillCode",
    },
    {
      title: "企业定额",
      dataIndex: "corpQuotaCode",
    },
    // {
    //   title: "单位",
    //   dataIndex: "unit",
    // },
    {
      title: "合同收入",
      children: [
        {
          title: "工程量",
          dataIndex: "num",
        },
        {
          title: "单价",
          dataIndex: "incomePrice",
        },
        {
          title: "合价",
          dataIndex: "incomeSumPrice",
        },
        {
          title: "单位",
          dataIndex: "groupBillUnit",
        },
      ],
    },
    {
      title: "目标成本",
      children: [
        {
          title: "工程量",
          dataIndex: "groupBillEngineeringNum",
        },
        {
          title: "单价",
          dataIndex: "price",
          render(dom) {
            return <Space>{dom ?? "-"}</Space>;
          },
        },
        {
          title: "合价",
          dataIndex: "sumPrice",
        },
        {
          title: "单位",
          dataIndex: "groupBillUnit",
        },
      ],
    },
    {
      title: "操作",
      width: "auto",
      fixed: "right",
      align: "center",
      render: (_, record) => {
        return (
          <Space>
            <Typography.Link
              disabled={projectInfo?.confirmStatus === 1}
              onClick={() => {
                modalRef.current?.show([
                  `${record.uuid},${record.groupBillCode}`,
                ]);
              }}
            >
              匹配企业定额
            </Typography.Link>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <ProTable
        actionRef={actionRef}
        search={false}
        scroll={{ x: "max-content" }}
        rowKey={(record) => {
          return `${record.uuid},${record.groupBillCode}`;
        }}
        bordered
        columns={columns}
        cardProps={{
          bodyStyle: { padding: 0 },
        }}
        request={async ({ current: pageNum, pageSize }) => {
          // if (!types?.typeId1 || !types?.typeId2) return { data: [] };
          const res = await ContractImportApi.getUnitProjectList({
            projectId: projectId,
            priceType: 3,
            stageType: tabKey,
            pageNum,
            pageSize,
          });
          setReloadNum(reloadNum + 1);
          return {
            data: res.data || [],
            success: true,
            total: res.totalRow,
          };
        }}
        summary={() => <AmountView priceType={3} stageType={tabKey} />}
        expandable={{
          expandedRowRender: (record) => {
            return <ChildTable record={record} key={reloadNum} />;
          },
        }}
        toolbar={{
          // actions: [selectProject, selectProjectType],
          menu: {
            type: "tab",
            activeKey: tabKey,
            items: [
              { label: "地下室阶段", key: "1" },
              { label: "主体", key: "2" },
              { label: "装饰修饰", key: "3" },
            ],
            onChange: (v) => {
              settabKey(v as string);
              actionRef.current?.reset?.();
            },
          },
        }}
        rowSelection={
          projectInfo?.confirmStatus === 1
            ? false
            : {
                selectedRowKeys: selectKeys,
                onChange(selectedRowKeys) {
                  setSelectKeys(selectedRowKeys as string[]);
                },
              }
        }
        tableAlertOptionRender={({ onCleanSelected }) => {
          return (
            <Space size={16}>
              <Typography.Link
                onClick={() => {
                  if (!selectKeys) return;
                  modalRef.current?.show(selectKeys);
                }}
              >
                批量匹配企业定额
              </Typography.Link>
              <Typography.Link onClick={onCleanSelected}>
                取消选择
              </Typography.Link>
            </Space>
          );
        }}
      />
      <MatchModal
        ref={modalRef}
        onSuccess={() => {
          actionRef.current?.reload();
          setSelectKeys(void 0);
          setReloadNum(reloadNum + 1);
        }}
      />
    </>
  );
};

export default ProjectCost;

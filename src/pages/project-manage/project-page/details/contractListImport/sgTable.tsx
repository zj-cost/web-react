/**
 * @author Destin
 * @description 合同清单导入-施工技术措施清单表
 * @date 2023/12/25
 */

import { ContractImportApi } from "@/apis/projectApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Typography } from "antd";
import { useContext, useEffect, useRef } from "react";
import { ProjectContext } from "..";
import useSelect from "../components/useSelect";
import ChildTable from "./childTable";
import MatchBtn from "./matchBtn";

const SgTable = ({ num }: { num: number }) => {
  const actionRef = useRef<ActionType>();
  const { projectId } = useContext(ProjectContext);
  const { selectProject, selectProjectType, types, getTypeList } = useSelect({
    actionRef: actionRef.current,
    type: 2,
  });
  const columns: ProColumns[] = [
    {
      title: "项目编码",
      dataIndex: "number",
    },
    {
      title: "项目名称",
      dataIndex: "name",
    },
    {
      title: "项目特征",
      dataIndex: "feature",
      render(dom) {
        return (
          <Typography.Paragraph
            style={{ width: 300, margin: 0 }}
            ellipsis={{ rows: 2, expandable: true }}
          >
            {dom}
          </Typography.Paragraph>
        );
      },
    },
    {
      title: "单位",
      dataIndex: "unit",
    },
    {
      title: "清单工程量",
      dataIndex: "num",
    },
    {
      title: "综合单价",
      dataIndex: "subtotal",
    },
    {
      title: "合价",
      dataIndex: "totalAmount",
    },
    {
      title: "匹配的局清单",
      dataIndex: "groupBillCodeList",
      render(_, entity) {
        return (
          <Typography.Paragraph
            style={{ width: 200, margin: 0 }}
            ellipsis={{ rows: 2, expandable: true }}
          >
            {entity["groupBillCodeList"]?.join("，") ?? "-"}
          </Typography.Paragraph>
        );
      },
    },
  ];

  useEffect(() => {
    getTypeList();
  }, [getTypeList, num]);

  return (
    <ProTable
      actionRef={actionRef}
      search={false}
      scroll={{ x: "max-content" }}
      rowKey={"id"}
      bordered
      columns={columns}
      cardProps={{
        bodyStyle: { padding: 0 },
      }}
      request={async ({ current: pageNum, pageSize }) => {
        if (!types?.typeId1 || !types?.typeId2) return { data: [] };
        const res = await ContractImportApi.getFbList({
          projectId: projectId,
          unitProjectUuid: types.typeId1,
          unitSectionUuid: types.typeId2,
          type: 2,
          pageNum,
          pageSize,
        });
        return {
          data: res.data || [],
          success: true,
        };
      }}
      toolbar={{
        settings: [],
        actions: [selectProject(), selectProjectType, <MatchBtn />],
      }}
      expandable={{
        expandedRowRender: (record) => {
          return (
            <ChildTable unitProjectUuid={types?.typeId1} uuid={record.uuid} />
          );
        },
      }}
    />
  );
};

export default SgTable;

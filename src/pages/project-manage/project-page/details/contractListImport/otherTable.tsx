/**
 * @author Destin
 * @description 其它项目
 * @date 2023/12/25
 */

import { ContractImportApi } from "@/apis/projectApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Space } from "antd";
import { useContext, useEffect, useRef } from "react";
import useSelect from "../components/useSelect";
import { ProjectContext } from "../detailContext";
import AddOtherModal from "./addOtherModal";

const OtherTable = () => {
  const actionRef = useRef<ActionType>();
  const { selectProject, types, getTypeList } = useSelect({
    actionRef: actionRef.current,
    type: 1,
  });
  const { projectId } = useContext(ProjectContext);

  const columns: ProColumns[] = [
    {
      title: "序号",
      dataIndex: "sort",
    },
    {
      title: "项目名称",
      dataIndex: "priceName",
    },
    {
      title: "金额(元)",
      dataIndex: "amount",
    },
  ];
  useEffect(() => {
    getTypeList();
  }, [getTypeList]);
  return (
    <>
      <ProTable
        actionRef={actionRef}
        search={false}
        scroll={{ x: "max-content" }}
        rowKey={"sort"}
        bordered
        columns={columns}
        cardProps={{
          bodyStyle: { padding: 0 },
        }}
        request={async () => {
          if (!types?.typeId1) return { data: [] };
          const res = await ContractImportApi.getOtherList({
            projectId: projectId,
            unitProjectUuid: types.typeId1,
          });
          return {
            data: res.data || [],
            success: true,
            total: res.totalRow,
          };
        }}
        toolbar={{
          title: (
            <Space>
              {selectProject(() => {
                actionRef.current?.reload();
              })}
              <AddOtherModal
                onSuccess={() => {
                  actionRef.current?.reload();
                }}
              />
            </Space>
          ),
        }}
      />
    </>
  );
};

export default OtherTable;

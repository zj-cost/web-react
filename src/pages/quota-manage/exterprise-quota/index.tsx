/**
 * @author Destin
 * @description 项目管理
 * @date 2023/10/07
 */

import ExterpriseApi from "@/apis/exterpriseApi";
import { FPage } from "@/components";
import {
  IExterpriseItemModel,
  IExterpriseTypeModel,
} from "@/models/exterpriseModel";
import {
  ActionType,
  ProColumns,
  ProFormTreeSelect,
  ProTable,
} from "@ant-design/pro-components";
import { Space, Typography } from "antd";
import { useRef } from "react";
import ImportBtn from "./importBtn";
import ExterpriseMatchModal, { IExterpriseMatchModalRef } from "./matchModal";
import PriceModal, { IPriceModalRef } from "./priceModal";

const ExterpriseQuotaPage = () => {
  const actionRef = useRef<ActionType>();
  const modalRef = useRef<IExterpriseMatchModalRef>(null);
  const priceRef = useRef<IPriceModalRef>(null);
  const columns: ProColumns<IExterpriseItemModel>[] = [
    {
      title: "分类",
      dataIndex: "code",
      hideInTable: true,
      initialValue: "ALL",
      renderFormItem: () => (
        <ProFormTreeSelect
          width={400}
          fieldProps={{
            popupMatchSelectWidth: false,
          }}
          request={async () => {
            const res = await ExterpriseApi.getType();
            const arr2tree = (arr?: IExterpriseTypeModel[]) => {
              if (!arr || arr.length === 0) return [];
              return arr.reduce((pre: any[], cur) => {
                pre.push({
                  label: cur.name,
                  value: cur.code ?? "ALL",
                  children: arr2tree(cur.childList),
                });
                return pre;
              }, []);
            };
            const opts = arr2tree(res.data);
            return opts;
          }}
        />
      ),
    },
    {
      title: "编号",
      dataIndex: "code",
      search: false,
    },
    {
      title: "定额编号",
      dataIndex: "corpQuotaCode",
      hideInTable: true,
    },
    {
      title: "名称",
      dataIndex: "name",
    },
    {
      title: "匹配局清单",
      dataIndex: "status",
      search: false,
      valueEnum: {
        0: { text: "未匹配", status: "Warning" },
        1: { text: "已匹配", status: "Success" },
        2: { text: "已确认", status: "Success" },
      },
    },
    {
      title: "计量单位",
      dataIndex: "unit",
      search: false,
    },
    {
      title: "项目特征",
      dataIndex: "feature",
      search: false,
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
      title: "工作内容",
      dataIndex: "content",
      search: false,
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
      title: "计量规则",
      dataIndex: "calcRule",
      search: false,
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
                modalRef.current?.show(val);
              }}
            >
              匹配
            </Typography.Link>
            <Typography.Link
              onClick={() => {
                priceRef.current?.show(val);
              }}
            >
              价格维护
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
        rowKey={"code"}
        request={async ({ current: pageNum, pageSize, ...val }) => {
          const res = await ExterpriseApi.getList({
            pageNum,
            pageSize,
            ...val,
          });
          return {
            data: res.data || [],
            success: true,
            total: res.totalRow,
          };
        }}
        search={{
          layout: "vertical",
        }}
        bordered
        columns={columns}
        toolbar={{
          actions: [<ImportBtn onSuccess={() => {}} />],
          multipleLine: true,
        }}
      />
      <ExterpriseMatchModal
        ref={modalRef}
        onCreate={() => {
          actionRef.current?.reload();
        }}
      />
      <PriceModal ref={priceRef} />
    </FPage>
  );
};

export default ExterpriseQuotaPage;

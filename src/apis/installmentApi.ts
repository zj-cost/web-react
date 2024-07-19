import { IBaseModel, IListBaseModel } from "@/models/baseModel";
import { BaseApi } from "@/utils/https/service";

export class InstallmentServer extends BaseApi {
  getDateList(params: {
    pageNum?: number;
    pageSize?: number;
    projectId: string;
  }) {
    return this.axios
      .get<IListBaseModel>("/member/mortgage/quantities/page", { params })
      .then((e) => e.data);
  }
  getMemberSum(params: {
    projectId: string;
    dateQuantitiesId: string;
    priceType: number;
    stageType: string;
  }) {
    return this.axios
      .get<
        IBaseModel<{
          actualIncome: number;
          incomeSumPrice: number;
          mortgageIncomeSumPrice: number;
          mortgageSumPrice: number;
          overshootRate: number;
          profitMargin: number;
          sumActualIncome: number;
          sumPrice: number;
        }>
      >("/member/mortgage/quantities/member/sum", { params })
      .then((e) => e.data);
  }
  getCostList(params: {
    pageNum?: number;
    pageSize?: number;
    projectId: string;
    dateQuantitiesId: string;
    priceType: number;
    stageType: string;
  }) {
    return this.axios
      .get<IListBaseModel>("/member/mortgage/quantities/list", { params })
      .then((e) => e.data);
  }
  getCostChildList(params: {
    pageNum?: number;
    pageSize?: number;
    id: string;
    monthDate: string;
  }) {
    return this.axios
      .get<IListBaseModel>("/member/mortgage/quantities/member/list", {
        params,
      })
      .then((e) => e.data);
  }
  getOtherCostList(params: {
    pageNum?: number;
    pageSize?: number;
    projectId: string;
    dateQuantitiesId: string;
    priceType: number;
    stageType: string;
    type: number;
  }) {
    return this.axios
      .get<IListBaseModel>("/member/other/mortgage/quantities", { params })
      .then((e) => e.data);
  }
  updateOther(data: { id: number; mortgageRatio: number; type: number }) {
    return this.axios
      .post("/member/other/mortgage/quantities/update", data)
      .then((e) => e.data);
  }
  addInstallment(data: any) {
    return this.axios
      .post("/member/mortgage/quantities/add", data)
      .then((e) => e.data);
  }
  importPrice(data: any) {
    return this.axios.post("/member/price/import", data).then((e) => e.data);
  }
  export(data: {
    projectId: string;
    monthDate?: string;
    pageNum?: number;
    pageSize?: number;
    priceType: number;
    stageType: number;
  }) {
    return this.axios.post("/price/file/export", data, {
      responseType: "arraybuffer",
    });
  }
  exportOther(data: {
    projectId: string;
    monthDate?: string;
    pageNum?: number;
    pageSize?: number;
    priceType: number;
    type: number;
    stageType: number;
  }) {
    return this.axios.post("/member/other/mortgage/quantities/export", data, {
      responseType: "arraybuffer",
    });
  }
  //导出实际成本
  exportActualCost(data: { projectId: string; monthDate: string }) {
    return this.axios.post(
      "/member/mortgage/quantities/group/bill/export",
      data,
      {
        responseType: "arraybuffer",
      },
    );
  }
  deleteInstallMent(data: { id: number }) {
    return this.axios.post("/member/mortgage/quantities/del", data);
  }
  approval(data: { id: number }) {
    return this.axios.post("/member/mortgage/quantities/status", data);
  }
  getPricePage(params: any) {
    return this.axios
      .get("/member/settlement/price/page", { params })
      .then((e) => e.data);
  }
  updatePrice(data: {
    dateQuantitiesId: number;
    groupBillUuid?: string;
    settlementPriceInfoId: string;
    stockNum?: number;
  }) {
    return this.axios.post("/member/settlement/price/update", data);
  }
}

const InstallmentApi = new InstallmentServer();
export default InstallmentApi;

const pushreturnwrapper = (obj, Qobj) => {
  obj.queries.push(Qobj);
  return obj;
};

export default class queryBuiler {
  constructor() {
    this.queries = [];
    this.group = (qobj) => {
      return pushreturnwrapper(this, {$group: qobj});
    };
    this.match = (qobj) => {
      return pushreturnwrapper(this, {$match: qobj});
    };
    this.sort = (qobj) => {
      return pushreturnwrapper(this, {$sort: qobj});
    };
    this.limit = (qobj) => {
      return pushreturnwrapper(this, {$limit: qobj});
    };
    this.project = (qobj) => {
      return pushreturnwrapper(this, {$project: qobj});
    };
    this.count = (qobj) => {
      return pushreturnwrapper(this, {$count: qobj});
    };
    this.clear = () => {
      this.queries = [];
      return this;
    };
  }
}

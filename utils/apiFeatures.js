class apiFeatures {
    constructor(query,queryObj){
        this.queryObj = queryObj;
        this.query = query;
    };
    filter( obj={} ){
        const fields=['keyword','limit','page','select','sort'];
        let filter={ ... this.queryObj , ... obj };
        fields . forEach(  field  => delete filter[field]  );
        let filterString=JSON.stringify(filter);
        filterString=filterString.replace( /gt|lt|lte|gte/ig , val => `$${val}` );
        filter=JSON.parse(filterString);
        this.query=this.query.find(filter);
        return this;
    };
    sort(){
        if(this.queryObj.sort){
            const sort=this.queryObj.sort.split(',').join(' ');
            this.query=this.query.sort(sort);
        };
        return this;
    };
    select(){
        if( this.queryObj.select ){
            const sort=this.queryObj.sort.split(',').join(' ');
            this.query=this.query.sort(sort);
        };
        return this;
    };
    async pagination(docsNum){
        const query={ ... this.query };
        const docsNum=await query.countDocuments();
        const page=this.queryObj.page * 1 || 1;
        const limit=this.queryObj.limit * 1 || 10;
        const skip = (page - 1) * limit;
        this.options={};
        this.options.currentPage=page;
        if( page > 1 ){
            this.options.previousPage=page-1;
        };
        if( docsNum > page*limit ){
            this.options.nextPage=page+1;
        };
        this.options.docsNum=docsNum;
        this.query=this.query.skip(skip).limit(limit);
        return this;
    };
    search(){
        if( this.queryObj.keyword ){
            const word=this.queryObj.keyword;
            this.query=this.query.find( { $text : { $search : word } } );
        };
        return this;
    };
};

module.exports = apiFeatures;
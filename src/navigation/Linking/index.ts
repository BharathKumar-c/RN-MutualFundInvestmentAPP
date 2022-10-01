const linking = {
  prefixes: ['marshmallowapp://','https://marshmallow-dev-api.itero.link/api/user/auth' ],
  config: {


       screens:{
        ResetPassword:{
          path:"ResetPassword/:id/:token"
        },
   
        },
  },
};

export default linking;

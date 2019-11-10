module.exports.createTableUsers = client => {
  client.query(
    `
      CREATE TABLE public.users
        (
            "address" varchar(50) NOT NULL,
            "department" varchar(25) NOT NULL,
            "email" varchar(25) NOT NULL,
            "firstName" varchar(15) NOT NULL,
            "gender" varchar(6) NOT NULL,
            "jobRole" varchar(25) NOT NULL,
            "lastName" varchar(15) NOT NULL,
            "password" varchar NOT NULL,
            "userID" varchar(7) NOT NULL,
            "groupID" varchar(7) NOT NULL,
            PRIMARY KEY ("email")
        );
      `,
    err => {
      if (err) {
        console.error("ERROR while creating Table : " + err);
      } else {
        console.log("Users Table Created successfully");
      }
    }
  );

  client.query(
    `
        ALTER TABLE public.users
        OWNER to postgres;
      `,
    err => {
      if (err) {
        console.error("Error while add Owner : " + err);
      } else {
        console.log("Users Table Owner Added successfully");
      }
    }
  );

  client.query(
    `
        COMMENT ON TABLE public.users
        IS 'user information store';
      `,
    err => {
      if (err) {
        console.error("Error while commenting : " + err);
      } else {
        console.log("Users Table commented successfully");
      }
    }
  );
};

module.exports.insertIntoTableUsers = (client, info, userID) => {
  //   console.log(info);
  client.query(
    `
    INSERT INTO public.users(
        address, department, email, "firstName", gender, "jobRole", "lastName", password, "userID", "groupID")
        VALUES ('${info.address}', '${info.department}', '${info.email}', '${info.firstName}', '${info.gender}', '${info.jobRole}', '${info.lastName}', '${info.password}', '${userID}', '${info.groupID}');
    `,
    err => {
      if (err) {
        console.error("Table Users insertion error : " + err);
      } else {
        console.log("Table Users insertion successfull");
      }
    }
  );
};

module.exports.authenticateUser = async (client, user) => {
  let fullUser = user;
  console.log(fullUser);

  let output = {
    isUserEmailValid: "",
    userHashedPassword: "",
    fullUser: {}
  };
  



  return output;
};

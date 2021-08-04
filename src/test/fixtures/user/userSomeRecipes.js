
let userId = "1234"
const userFixture = () => {
  return {
    username: "user1",
    email: "email@email.com",
    password: "default",
    id: userId,
    recipes: [
      {id: "a2b3c4e1",name: "waffles", description: "desc", user: userId},
      {id: "a1b3c4e2", name: "spaghetti", user: userId},
      {id: "a4b6c231", name: "pizza", user: userId}
    ]
  }
}


export default userFixture;
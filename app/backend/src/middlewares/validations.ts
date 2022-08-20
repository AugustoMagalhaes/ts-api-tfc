class Validations {
  public static loginValidation = async (email: string, password: string) => {
    if (!email || !password) {
      return 'All fields must be filled';
    }
  };
}

export default Validations;

import { UserTypePipeWithArticle } from '@accounts/pipes/user-type-with-article.pipe';

describe('UserTypePipeWithArticle', () => {
  const pipe = new UserTypePipeWithArticle();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform appropriate user_type to text', () => {
    expect(pipe.transform('operator_admin')).toEqual('an operator admin user');
    expect(pipe.transform('operator')).toEqual('an operator user');
    expect(pipe.transform('consultant_agent')).toEqual('a consultant/agent');
    expect(pipe.transform('emitter_contact')).toEqual('an emitter contact user');
    expect(pipe.transform('some default text')).toEqual('some default text');
  });
});

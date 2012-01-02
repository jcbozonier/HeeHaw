require 'sinatra'

get '/' do
  erb :index
end

run Sinatra::Application
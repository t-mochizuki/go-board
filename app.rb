require 'thin'
require 'em-websocket'
require 'sinatra/base'

EM.run do
  # ... [previous Sinatra stuff]
  class App < Sinatra::Base
    get '/' do
      erb :index
    end
  end

  @clients = []
  @color = 0
  @images = {}

  EM::WebSocket.start(:host => '0.0.0.0', :port => '3001') do |ws|
    ws.onopen do |handshake|
      @clients << ws
      ws.send "Connected to #{handshake.path}."

      @images.each do |image|
        ws.send "#{image[0]},#{image[1]}"
      end
    end

    ws.onclose do
      ws.send "Closed."
      @clients.delete ws
    end

    ws.onmessage do |msg|
      puts "Received Message: #{msg},#{@color}"
      @clients.each do |socket|
        socket.send "#{msg},#{@color}"
      end

      if @images.include? msg
        # puts "test: #{@images}"
        @images.delete msg
        # puts "test: #{@images}"
      else
        @images[msg] = @color.to_s
        @color += 1
        @color %= 2
      end
    end
  end

  # ... [run Sinatra server]
  App.run! :port => 3000

  Signal.trap(:INT) {
    EM.stop
  }
end

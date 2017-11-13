require 'google/api_client'

GA_P12 = File.expand_path(File.join(__FILE__, '..', '..', 'ga.p12'))

class GoogleAnalyticsDownloader

  def self.fetch
    client  = Google::APIClient.new

    client.authorization = Signet::OAuth2::Client.new(
      :token_credential_uri => 'https://accounts.google.com/o/oauth2/token',
      :audience             => 'https://accounts.google.com/o/oauth2/token',
      :scope                => 'https://www.googleapis.com/auth/analytics.readonly',
      :issuer               => "13001872082-jvmq5jsb2clnsh64879genqijvgg2k41@developer.gserviceaccount.com",
      :signing_key          => Google::APIClient::PKCS12.load_key(GA_P12, 'notasecret')
    ).tap { |auth| auth.fetch_access_token! }

    api_method = client.discovered_api('analytics', 'v3').data.ga.get

    result = client.execute(:api_method => api_method, :parameters => {
      'ids'        => 'ga:106545591',
      'start-date' => (Date.today - 30).strftime('%Y-%m-%d'),
      'end-date'   => Date.today.strftime('%Y-%m-%d'),
      'dimensions' => 'ga:pagePath',
      'metrics'    => 'ga:pageViews',
      'samplingLevel' => 'HIGHER_PRECISION',
      "max_results" => 1000,
      'filters'    => 'ga:pagePath=~www.algolia.com/doc/*;ga:pageViews>10'
    })
    stats = {}

    result.data.rows.each do |row|
      path = row[0].gsub(/.*?algolia\.com\/doc\/(.*?)$/, 'doc/\1').split(/[?#]/).first.gsub('index.html', '').gsub(/\/$/, '')
      stats[path] ||= 0
      stats[path] += row[1].to_i
    end

    stats
  end

end

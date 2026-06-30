from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


ROOT_DIR = Path(__file__).resolve().parents[1]
load_dotenv(ROOT_DIR / ".env")


class Settings(BaseSettings):
    db_host: str = Field(default="localhost", alias="DB_HOST")
    db_port: int = Field(default=3306, alias="DB_PORT")
    db_user: str = Field(default="root", alias="DB_USER")
    db_password: str = Field(default="", alias="DB_PASSWORD")
    db_name: str = Field(default="pup_intrack", alias="DB_NAME")
    api_port: int = Field(default=3001, alias="API_PORT")

    smtp_host: str | None = Field(default=None, alias="SMTP_HOST")
    smtp_port: int = Field(default=587, alias="SMTP_PORT")
    smtp_secure: bool = Field(default=False, alias="SMTP_SECURE")
    smtp_user: str | None = Field(default=None, alias="SMTP_USER")
    smtp_pass: str | None = Field(default=None, alias="SMTP_PASS")
    smtp_from: str | None = Field(default=None, alias="SMTP_FROM")

    mail_server: str | None = Field(default=None, alias="MAIL_SERVER")
    mail_port: str | None = Field(default=None, alias="MAIL_PORT")
    mail_use_ssl: bool = Field(default=False, alias="MAIL_USE_SSL")
    mail_username: str | None = Field(default=None, alias="MAIL_USERNAME")
    mail_password: str | None = Field(default=None, alias="MAIL_PASSWORD")
    mail_default_sender: str | None = Field(default=None, alias="MAIL_DEFAULT_SENDER")

    model_config = SettingsConfigDict(extra="ignore", populate_by_name=True)

    @property
    def effective_smtp_host(self) -> str | None:
        return self.smtp_host or self.mail_server

    @property
    def effective_smtp_port(self) -> int:
        try:
            return int(self.mail_port) if self.mail_port else self.smtp_port
        except ValueError:
            return self.smtp_port

    @property
    def effective_smtp_secure(self) -> bool:
        return self.smtp_secure or self.mail_use_ssl

    @property
    def effective_smtp_user(self) -> str | None:
        return self.smtp_user or self.mail_username

    @property
    def effective_smtp_pass(self) -> str | None:
        return self.smtp_pass or self.mail_password

    @property
    def effective_smtp_from(self) -> str:
        return (
            self.smtp_from
            or self.mail_default_sender
            or self.effective_smtp_user
            or "InTrack <no-reply@intrack.local>"
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()
